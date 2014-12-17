$(function(){
	$('.tabs a').click(function(event){
		event.preventDefault();
		$('.tabs a, .tabWrapper').removeClass('active');
		$(this).addClass('active');
		var href = $(this).attr('href');
		$('.tabWrapper'+href).addClass('active');
	})

	$('.file.button').click(function(event){
		$(this).next('input').click();
	})
})