"use strict";

var $ = jQuery;


var backButton, header;

function whyChoseUsHeightFix() {
	var whatWeNeedHeight = $('.why-chose-us-cards').removeAttr('style').getMaxHeight();
	$('.why-chose-us-cards').css('height', whatWeNeedHeight+'px');
}

$(document).ready(function($){


	$('.menu-smooth-scroll').scrollingTo({
		easing : 'easeOutQuad',
		extraSpace : 60,
		callbackBeforeTransition : function(){
			menuFun.hide();
		}
	});


	// progressbar animation

	$('[data-action="progress-bar"]').waypoint({

		handler: function(event, direction) {

			$(this).find('.progress-bar-L1').each(function(){
				var width = $(this).data('width');
				$(this).css('width', width);
			});
		},
		
		offset: '90%'

	});

	// accordion js

	var accordions = $('[data-action="accordionWithImage"]');

	if ( accordions.length > 0 ) {
		accordions.each(function(){

			var $this = $(this);
			var $thumbWrap = $this.find('.acc-thumb-area');

			$this.find('.single-acc-item .collapse-label').on('click', function(){
				var $parent = $(this).parent();

				if ( $this.find('.collapse-content:animated').length < 1 ) {
					if( !$parent.hasClass('collapse-open') ) {

						$parent.addClass('init-color').removeClass('init-remove-color');
						$(this).siblings('.collapse-content').slideDown(function(){
							$parent.addClass('collapse-open');
						});

						$parent.siblings('.collapse-open').removeClass('init-color').addClass('init-remove-color').find('.collapse-content').slideUp(function(){
							$(this).parent().removeClass('collapse-open');
						});

						var image = $thumbWrap.find('img');

						if ( image.length > 0 && $parent.data('image-src') ) {

							image.animate({
								'opacity': '0'
							}, 100, function(){
								$(this).attr( 'src', $parent.data('image-src') );
							});
							
							image.one('load', function(){
								image.animate({
									'opacity': '1'
								}, 200);
							});
						}
					}
				}

			});

		});
	}



	/* why Chose Us Slider */

	var whyChoseUsSlider = $('[data-action="whyChoseUsSlider"]');

	if ( whyChoseUsSlider.length > 0 ) {

		whyChoseUsSlider.owlCarousel({
			slideSpeed : 500,
			itemsCustom : [
				[0, 1],
				[540, 2],
				[992, 3],
				[1200, 4]
			],
			itemsMobile : false,
			pagination : false
		});

		var whyChoseUsSliderController = $('.wcu-slider-wrap .slider-cntrl a');

		if ( whyChoseUsSliderController.length > 0 ) {

			whyChoseUsSliderController.on('click', function(e){

				e.preventDefault();

				var whyChoseUsSliderData = $(this).closest('.wcu-slider-wrap').find('[data-action="whyChoseUsSlider"]').data('owlCarousel');

				$(this).hasClass('left-arrow') ? whyChoseUsSliderData.prev() : whyChoseUsSliderData.next();

			});

		}

	}




	/* Brief Slider */

	var briefSlider = $('[data-action="briefSlider"]');

	if ( briefSlider.length > 0 ) {

		briefSlider.owlCarousel({
			slideSpeed : 800,
			singleItem : true, 
			pagination : true,
			autoPlay : false
		});

		var briefSliderController = $('.brief-slider-wrap .slider-cntrl a');

		if ( briefSliderController.length > 0 ) {

			briefSliderController.on('click', function(e){

				e.preventDefault();

				var briefSliderData = $(this).closest('.brief-slider-wrap').find('[data-action="briefSlider"]').data('owlCarousel');

				$(this).hasClass('left-arrow') ? briefSliderData.prev() : briefSliderData.next();

			});

		}

	}



	/* team slider*/

	var teamSlider = $('[data-action="teamSlider"]');

	if ( teamSlider.length > 0 ) {
		teamSlider.owlCarousel({
			itemsCustom : [
				[0, 1],
				[540, 2],
				[992, 3],
				[1200, 4]
			],
			autoPlay : true,
			stopOnHover : true,
			itemsMobile : false,
			pagination : true
		});
	}




	/* testimonial slider */

	var testimonialSlider = $('[data-action="testimonialSlider"]');

	if ( testimonialSlider.length > 0 ) {
		testimonialSlider.owlCarousel({
			singleItem : true,
			pagination : true,
			autoPlay : false
		});
	}


	/* clients slider */

	var clientSlider = $('[data-action="clientSlider"]');

	if ( clientSlider.length > 0 ) {
		clientSlider.owlCarousel({
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,4],
			itemsTablet: [600,2],
			itemsMobile : false,
			pagination : false,
			autoPlay : true
		});
	}



	/*=========== count up statistic ==========*/

	var $countWrapper = $('[data-action="count-up"]');
	var $firstTabInit = $countWrapper.find('.mdl-tabs__panel:first-child .countNumb');

	if ( $firstTabInit.length > 0 ) {
		$firstTabInit.counterUp({
			delay: 20,
			time: 1500
		});
	}
	// Service On Click Count down
	$countWrapper.find('.matx-service-tabbar a').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		
		$this.closest('.mdl-js-tabs').find( $this.attr('href') ).find('.countNumb').counterUp({
			delay: 35,
			time: 600
		});
	});




	// Magnific Popup For Portfolio items
	$('.protfolio-items').magnificPopup({
		delegate: 'a.ajax-portfolio',
		type: 'ajax',
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});



	// Magnific Popup For Portfolio Details
	$('body').magnificPopup({
		delegate: 'a.ajax-portfolio-details',
		type: 'ajax',
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});

	// Portfolio Details Attachment Change
	$('body').delegate('a.portfolio-details-image-link', 'click', function(e){
		e.preventDefault();
		$(this).addClass('active').siblings('a').removeClass('active');
		var image = '<img src="'+ $(this).attr('href') +'" alt="">';
		$(this).closest('.profolio-preview').find('.pre-body-inner').html(image);
	});

	// Portfolio Details Popup Close
	$('body').delegate('.pre-close a', 'click', function(e){
		e.preventDefault();
		var magnificPopup = $.magnificPopup.instance;
		magnificPopup.close();
	});


	// Portfolio attachment zoom
	$('body').delegate('.pre-body-inner img', 'click', function(e){
		$(this).closest('.profolio-preview').toggleClass('zoomed');
	});


	// show video popup
	$('.show-video').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false
	});


	// Tweets show and slider
	(function(){

		var twitterSlider = $('#tweetSlider');
		if ( twitterSlider.length > 0 ) {

			twitterSlider.twittie({
				count : 3, // Change it as how many tweets you need to show
				template : '<div class="twitter-info"><div class="tweet-text"><p>{{tweet}}</p></div><div class="twitt-tools"><ul class="twiiter-options"><li><a class="relpy-btn" href="https://twitter.com/intent/tweet?in_reply_to={{tweetId}}"><i class="zmdi zmdi-mail-reply"></i><span>Reply</span></a></li><li><a class="retweet-btn" href="https://twitter.com/intent/retweet?tweet_id={{tweetId}}"><i class="zmdi zmdi-repeat"></i><span>Retweet</span></a></li><li><a class="favorite-btn" href="https://twitter.com/intent/favorite?tweet_id={{tweetId}}"><i class="zmdi zmdi-favorite"></i><span>Favorite</span></a></li></ul></div></div>'

			}, function(){

				var tweetSlider = $('#allTweets');

				tweetSlider.owlCarousel({
					singleItem : true,
					pagination : true,
					autoPlay : true,
					stopOnHover : true
				});

			});

		}

	}());

});


$(window).load(function(){

	// Why Chose Us Height Fix
	whyChoseUsHeightFix();


	// Portfolio Isotop
	(function(){

		var portfolioArea = $('[data-action="portfolio"]');

		if ( portfolioArea.length > 0 ) {

			portfolioArea.each(function(){

				var $this = $(this);

				var portfolioIsotop = $this.find('.protfolio-items');

				// init Isotope
				var loaded = 0, ajaxItems, loadMore = true, currentFilter = '*',
					$loadMoreBtn = $this.find('[data-action="portfolioLoadItem"]'),
					$ajaxItemsDiv = $this.find('[data-action="portfolioInitItem"]');

				var portfolioMsnry = portfolioIsotop.isotope({
					isOriginLeft: !window.RTL_Enabled,
					itemSelector: '.single-portfolio',
					layoutMode: 'fitRows',
					transitionDuration: '.6s',
					hiddenStyle: {
						opacity: 0,
						transform: "scale(.85)"
					},
					visibleStyle: {
						opacity: 1,
						transform: "scale(1)"
					}
				});



				$this.find('.portfolio-category .filter').on( 'click', function(e) {

					e.preventDefault();

					if( $loadMoreBtn.length > 0 ) {
						$loadMoreBtn.removeAttr('disabled');
					}


					if ( $(this).hasClass('active') ) {
						return false;
					} else {
						$(this).addClass('active').siblings('li').removeClass('active');
					}

					var $this = $(this);
					var filterValue = $this.data('target');

					if ( filterValue == '*' ) {
						currentFilter = '*';
					} else {
						currentFilter = $this.text();	
					}

					// set filter for Isotope
					portfolioMsnry.isotope({ filter: filterValue });

					// Refresh skrollr elements
					var handler = setTimeout(function(){
						skrolr.refresh( $('.bg-image:not(".banner-bg")') );
						clearTimeout(handler);
					}, 1500);

					return $(this);
				});

				var loadData = function(ajaxItems, $btn) {
					if ( ajaxItems ) {
						var lists, loadedIds = [], target = $this.find('.portfolio-category .filter.active').data('target');

						portfolioIsotop.children().each(function(){
							loadedIds.push($(this).attr('id'));
						});

						if ( target != '*' ) {
							lists = $(ajaxItems).find('.single-portfolio'+target).filter(function(){
								return ( loadedIds.indexOf( $(this).attr('id') ) == -1 );
							});
						} else {
							lists = $(ajaxItems).find('.single-portfolio').filter(function(){
								return ( loadedIds.indexOf( $(this).attr('id') ) == -1 );
							});
						}

						loadMore = ( lists.length < 1 ) ? false : true;

						if ( loadMore === true ) {

							$ajaxItemsDiv.html(lists).imagesLoaded().then(function(){
								for (var i = 0; i < 3; i++) {
									var $this = $ajaxItemsDiv.children().first();

									if ( $this.index() < 0 ) {

										$btn.attr('disabled', 'disabled');

									} else {

										portfolioMsnry.isotope( 'insert', $this );
										
										// Refresh skrollr elements
										var handler = setTimeout(function(){
											skrolr.refresh( $('.bg-image:not(".banner-bg")') );
											clearTimeout(handler);
										}, 1500);

										if ( $ajaxItemsDiv.children().length > 0 ) {
											$btn.removeAttr('disabled');
										} else {
											$btn.attr('disabled', 'disabled');
										}

									}

								}
							});

						} else {

							if ( target == '*' ) {
								sweetAlert("Sorry", "There are no items", "info");
							} else {
								sweetAlert("Sorry", "There are no "+currentFilter+" items", "info");
							}

							$btn.attr('disabled', 'disabled');

						}
					}
				};

				if ( $loadMoreBtn.length > 0 ) {

					$loadMoreBtn.on( 'click', function(e) {

						e.preventDefault();

						var $this = $(this);

						$this.attr('disabled', 'disabled');

						if ( ajaxItems ) {

							loadData(ajaxItems, $this);

						} else {

							$.ajax({
								cache: false,
							    url: 'portfolioitems.html',
							    success: function(data) {
							    	ajaxItems = data;
							    	loadData(ajaxItems, $this);
							    }
							});

						}
					});

				}

			});

		}
	}());

});


doneResize(function(){

	// Why Chose Us Height Fix
	whyChoseUsHeightFix();
});