function Gallery () {
	this.init = function () {
		$('.gallery .folder').on('click', function (e) {
			e.preventDefault();
			$.get('/admin/gallery?path=' + $(this).attr('href'));
			return false;
		});
	};

	this.init();
};