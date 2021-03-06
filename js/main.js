var dh = new dataHandler();
var dataMiner = new dataMining();
var countries = new countries();
var observer = new observer();

function test(){
    dataMiner.data = dh.getDataMiningData();
    dh.normalizeData(dataMiner.data);
    dataMiner.drawClusters = true;
    dataMiner.calculateClusters();
    observer.updateGraphs();
}

$("#container").hide(); // Hide the container at startup

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
    });

});

window.onresize=function(){showYearSpan();}; //located in slider.js


