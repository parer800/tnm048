var sp = new sp();
var ld = new ld();
var dh = new dataHandler();
var observer = new observer();

/*
		Suscribe on selected data change
*/
function analyzeChosenData(){

}

 /*----------------------------------------------------------------------- */
ko.applyBindings(dataViewModel, document.getElementById('container'));

// Should probably be located in other file
$(document).ready(function () {
	$('#menu').toggleClass('open');
	$('#menu .close').html("Hide <span class='glyphicon glyphicon-resize-small'></span>");
    $('.menu, .close').click(function () {
        $('#menu').toggleClass('open');
        if ($('#menu').hasClass("open")) {
        	$('#energy-sources').show();
            $('#menu .close').html("Hide <span class='glyphicon glyphicon-resize-small'></span>");

            
        } else {
        	$('#energy-sources').hide();
            $('#menu .close').html("Show <span class='glyphicon glyphicon-resize-vertical'></span>");
        }
    })
});

