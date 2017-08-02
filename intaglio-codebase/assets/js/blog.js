"use strict";

$(document).ready(function(){

	/* blog Mesonary */

	(function(){
		if ( $('#blog-posts-mesonary').length > 0 ) {
			window.blogMsnry = $('#blog-posts-mesonary').isotope({
				itemSelector: '.single-blog-post',
				isInitLayout: false,
				layoutMode: 'masonry'
			});
		}
	}());

	/* Search */
	(function(){

		var sCon = $('#fullSearch');
		$('.search-open').on('click', function(e){

			var scale = $(window).width() * 2 / 45;
			
			sCon.find('.search-bg').css({
				'transform': 'scale('+scale+')',
				'top': e.pageY+'px',
				'left': e.pageX+'px'
			});

			sCon.addClass('show').removeClass('hide-bg');

			var handler = setTimeout(function(){
				sCon.addClass('show-contents');
				clearTimeout(handler);

				$( "#search-blog" ).focus();
			}, 600);
		});

		$('.search-close').on('click', function(e){
			if( sCon.hasClass('show')){
				sCon.addClass('hide-bg').removeClass('show-contents');
				var handler = setTimeout(function(){
					sCon.removeClass('show');
					clearTimeout(handler);
				}, 600);
			}
		});
		
	}());



	/* BackToTop */
	window.backToTop = {

		button : $('#backToTop'),

		show : function() {
			var self = this;
			if ( self.button.hasClass('hide-bottom') ) {
				self.button.removeClass('hide-bottom');

				var handler = setTimeout(function(){
					self.button.removeClass('shade-on');
					clearTimeout(handler);
				}, 800);
			}
		},

		hide : function() {
			var self = this;
			if ( !self.button.hasClass('hide-bottom') ) {
				self.button.addClass('shade-on').addClass('hide-bottom');
			}
		}
	};

	backToTop.button.on('click', function(){

		$('html, body').stop(true, true).animate({
			'scrollTop' : '0px'
		}, 600, 'easeOutQuad');

	});
});


$(window).load(function(){

	/* Blog masonry re layout */

	if ( typeof blogMsnry !== "undefined" ) {
		blogMsnry.isotope('layout');
	}

});


$(window).on('scroll', function(e){
	if ( e.currentTarget.scrollY > $(window).height() ) {
		backToTop.show();
	} else {
		backToTop.hide();
	}
});