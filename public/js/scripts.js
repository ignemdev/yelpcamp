$(document).ready(() => $('main').css('margin-top', $('nav').outerHeight()));

$('[data-toggle="popover"]')
	.on('click', () => {
		$('body').toggleClass('body-noscroll');
	})
	.popover({
		sanitize: false
	})
	.on('shown.bs.popover', function() {
		const popover = $('.popover');
		let top = popover.outerHeight() / 2 - $(this).outerHeight() / 2;
		popover.animate({ top: top }, 'fast');
	});
