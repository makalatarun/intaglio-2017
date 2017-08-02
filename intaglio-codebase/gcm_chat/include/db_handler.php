<?php
 
/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 */
class DbHandler {
 
    private $conn;
 
    function __construct() {
        require_once dirname(__FILE__) . '/db_connect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }
 
    // creating new user if not existed
    public function createUser($name, $email) {
        $response = array();
 
        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // insert query
            $stmt = $this->conn->prepare("INSERT INTO users(name, email) values(?, ?)");
            $stmt->bind_param("ss", $name, $email);
 
            $result = $stmt->execute();
 
            $stmt->close();
 
            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                $response["error"] = false;
                $response["user"] = $this->getUserByEmail($email);
            } else {
                // Failed to create user
                $response["error"] = true;
                $response["message"] = $name.$email."Oops! An error occurred while registereing";
            }
        } else {
            // User with same email already existed in the db
            $response["error"] = false;
            $response["user"] = $this->getUserByEmail($email);
        }
 
        return $response;
    }
 
    // updating user GCM registration ID
    public function updateGcmID($user_id, $gcm_registration_id) {
        $response = array();
        $stmt = $this->conn->prepare("UPDATE users SET gcm_registration_id = ? WHERE user_id = ?");
        $stmt->bind_param("si", $gcm_registration_id, $user_id);
 
        if ($stmt->execute()) {
            // User successfully updated
            $response["error"] = false;
            $response["message"] = 'GCM registration ID updated successfully';
        } else {
            // Failed to update user
            $response["error"] = true;
            $response["message"] = "Failed to update GCM registration ID";
            $stmt->error;
        }
        $stmt->close();
 
        return $response;
    }
 
    // fetching single user by id
    public function getUser($user_id) {
        $stmt = $this->conn->prepare("SELECT user_id, name, email, gcm_registration_id, created_at FROM users WHERE user_id = ?");
        $stmt->bind_param("s", $user_id);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($user_id, $name, $email, $gcm_registration_id, $created_at);
            $stmt->fetch();
            $user = array();
            $user["user_id"] = $user_id;
            $user["name"] = $name;
            $user["email"] = $email;
            $user["gcm_registration_id"] = $gcm_registration_id;
            $user["created_at"] = $created_at;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }
 
    // fetching multiple users by ids
    public function getUsers($user_ids) {
 
        $users = array();
        if (sizeof($user_ids) > 0) {
            $query = "SELECT user_id, name, email, gcm_registration_id, created_at FROM users WHERE user_id IN (";
 
            foreach ($user_ids as $user_id) {
                $query .= $user_id . ',';
            }
 
            $query = substr($query, 0, strlen($query) - 1);
            $query .= ')';
 
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
			$stmt->bind_result($userid_tmp,$name_tmp,$email_tmp,$gcmregid_tmp,$createdat_tmp);
            //$result = $stmt->get_result();
 
            //while ($user = $result->fetch_assoc()) {
			while($stmt->fetch()) {	
			    $tmp = array();
                $tmp["user_id"] = $userid_tmp;
                $tmp["name"] = $name_tmp;
                $tmp["email"] = $email_tmp;
                $tmp["gcm_registration_id"] = $gcmregid_tmp;
                $tmp["created_at"] = $createdat_tmp;
                array_push($users, $tmp);
            }
			$stmt->close();
        }
        return $users;
    }
 
    // messaging in a chat room / to persional message
    public function addMessage($user_id, $chat_room_id, $message) {
        $response = array();
 
        $stmt = $this->conn->prepare("INSERT INTO messages (chat_room_id, user_id, message) values(?, ?, ?)");
        $stmt->bind_param("iis", $chat_room_id, $user_id, $message);
 
        $result = $stmt->execute();
 
        if ($result) {
            $response['error'] = false;
 
            // get the message
            $message_id = $this->conn->insert_id;
            $stmt = $this->conn->prepare("SELECT message_id, user_id, chat_room_id, message, created_at FROM messages WHERE message_id = ?");
            $stmt->bind_param("i", $message_id);
            if ($stmt->execute()) {
                $stmt->bind_result($message_id, $user_id, $chat_room_id, $message, $created_at);
                $stmt->fetch();
                $tmp = array();
                $tmp['message_id'] = $message_id;
                $tmp['chat_room_id'] = $chat_room_id;
                $tmp['message'] = $message;
                $tmp['created_at'] = $created_at;
                $response['message'] = $tmp;
            }
        } else {
            $response['error'] = true;
            $response['message'] = 'Failed send message';
        }
 
        return $response;
    }
 
    // fetching all chat rooms
    public function getAllChatrooms() {
    	$tasks=array();
        $stmt = $this->conn->prepare("SELECT chat_room_id,name,created_at FROM chat_rooms");
        $stmt->execute();
        //$tasks = $stmt->get_result();
		$stmt->bind_result($chatroom_tmp,$name_tmp,$createdat_tmp);
		while($stmt->fetch()) {	
			$tmp = array();
			$tmp["chat_room_id"] = $chatroom_tmp;
			$tmp["name"] = $name_tmp;
			$tmp["created_at"] = $createdat_tmp;
			array_push($tasks, $tmp);
		}
        $stmt->close();
        return $tasks;
    }
 
    // fetching single chat room by id
    function getChatRoom($chat_room_id) {
        $tasks = array();
        $stmt = $this->conn->prepare("SELECT cr.chat_room_id, cr.name, cr.created_at as chat_room_created_at, u.name as username, c.message_id, c.user_id, c.message, c.created_at FROM chat_rooms cr LEFT JOIN messages c ON c.chat_room_id = cr.chat_room_id LEFT JOIN users u ON u.user_id = c.user_id WHERE cr.chat_room_id = ?");
        $stmt->bind_param("i", $chat_room_id);
        $stmt->execute();
        //$tasks = $stmt->get_result();
        $stmt->bind_result($chatroomid_tmp,$name_tmp,$createdat_tmp,$usercreatedname_tmp,$c1,$c2,$c3,$c4);
		while($stmt->fetch()) {	
			$tmp = array();
			$tmp["chat_room_id"] = $chatroomid_tmp;
			$tmp["name"] = $name_tmp;
			$tmp["chat_room_created_at"] = $createdat_tmp;
			$tmp["username"] = $usercreatedname_tmp;
			$tmp["message_id"] = $c1;
			$tmp["user_id"] = $c2;
			$tmp["message"] = $c3;
			$tmp["created_at"] = $c4;
			array_push($tasks, $tmp);
		}
		$stmt->close();
        return $tasks;
    }
 
    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $stmt = $this->conn->prepare("SELECT user_id from users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }
 
    /**
     * Fetching user by email
     * @param String $email User email id
     */
    public function getUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT user_id, name, email, created_at FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($user_id, $name, $email, $created_at);
            $stmt->fetch();
            $user = array();
            $user["user_id"] = $user_id;
            $user["name"] = $name;
            $user["email"] = $email;
            $user["created_at"] = $created_at;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }
 
}
 
?>