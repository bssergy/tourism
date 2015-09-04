function Gallery () {
	this.init = function () {
		var that = this;
		$('.gallery .folder').on('click', function (e) {
			e.preventDefault();
			$.get('/admin/gallery?path=' + $(this).attr('href'), function (data) {
				$('.modal-body').empty();
				$(data).find('.gallery').appendTo('.modal-body');
				that.init();
			});
			return false;
		});
	};

	this.init();
};