var sp = new sp();
var ld = new ld();
var dh = new dataHandler();
var observer = new observer();
var dataTable;

var DataFile = function (type, subtype, url){
	this.type = type;
	this.subtype = subtype;
	this.url = url; 
};

var dataViewModel = {
	//Skulle kunna vara 'observableArray' men vi behöver inte veta ifall filnamnen ändras eftersom de är statiska
	availableData : [
		new DataFile("oil", "supply", "data/Total_Oil_Supply_(Thousand_Barrels_Per_Day)"),
		new DataFile("coal", "consumption", "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day)")
	],
	selectedChoice: ko.observable() // Inget valt från början
};

/*
		Suscribe on selected data change
*/

dataViewModel.selectedChoice.subscribe(function (dataFile){
	if(typeof dataFile !== 'undefined'){ 
		sp.loadData(dataFile.url);
		//ld.loadData(data.url);
		dh.loadData(dataFile);
	}
});

sp.defineAxis();
//ld.defineAxis(); 

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

