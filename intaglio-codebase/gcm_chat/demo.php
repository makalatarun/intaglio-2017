<?php
 
/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 */
class Demo {
 
    private $conn;
 
    function __construct() {
        require_once dirname(__FILE__) . '/include/db_connect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }
 
    public function getAllChatRooms() {
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
 
    public function getAllUsers() {
		$tasks=array();
        $stmt = $this->conn->prepare("SELECT user_id,name,email,gcm_registration_id,created_at FROM users");
        $stmt->execute();
        //$tasks = $stmt->get_result();
		$stmt->bind_result($v1,$v2,$v3,$v4,$v5);
		while($stmt->fetch()) {	
			$tmp = array();
			$tmp["user_id"] = $v1;
			$tmp["name"] = $v2;
			$tmp["email"] = $v3;
			$tmp["gcm_registration_id"] = $v4;
			$tmp["created_at"] = $v5;
			array_push($tasks, $tmp);
		}
        $stmt->close();
        return $tasks;
    }
 
    public function getDemoUser() {
        $name = 'AndroidHive';
        $email = 'admin@androidhive.info';
         
        $stmt = $this->conn->prepare("SELECT user_id from users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        if ($num_rows > 0) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
            return $user_id;
        } else {
            $stmt = $this->conn->prepare("INSERT INTO users(name, email) values(?, ?)");
            $stmt->bind_param("ss", $name, $email);
            $result = $stmt->execute();
            $user_id = $stmt->insert_id;
            $stmt->close();
            return $user_id;
        }
    }
}
?>