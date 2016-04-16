(function(){
	$(document).ready(function(){

	});

	$(document).on('click', '[data-action="yes"]', function(){
		$('body').addClasS('yes');
	});

	$(document).on('click', '[data-action="no"]', function(){
		$('body').addClasS('no');
	});
})();