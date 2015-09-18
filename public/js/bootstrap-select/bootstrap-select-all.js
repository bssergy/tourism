(function ($) {
	$.fn.selectAll = function () {
	  $(this).on('changed.bs.select', function(e, index) {
        if (!$(this).val() || index == 0)
        {
          $(this).selectpicker('deselectAll');
          $(this).val('');
          $(this).selectpicker('refresh');
        } else {
          if ($(this).val())
          {
            var values = $(this).val().toString().split(',');
            if (values[0] === '') {
              values.shift();
              $(this).val(values.join(','));
              $(this).selectpicker('refresh');
            }
          }
        }
      });
	}
})(jQuery);