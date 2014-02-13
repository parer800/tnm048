var sp = new sp();
var ld = new ld();

var viewModel = {
	foo : ko.observable("observer")
};

var DataFile = function (datatype, url){
	this.datatype = datatype;
	this.url = url; 
};

var dataViewModel = {
		//Skulle kunna vara 'observableArray' men vi behöver inte veta ifall filnamnen ändras eftersom de är statiska
		availableData : [
		new DataFile("oil","data/Total_Oil_Supply_(Thousand_Barrels_Per_Day)"),
		new DataFile("coal","data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day)")
	],
	selectedChoice: ko.observable() // Inget valt från början
};

/*
		Suscribe on selected data change
*/
dataViewModel.selectedChoice.subscribe(function (data){
	if(typeof data !== 'undefined'){
		sp.loadData(data.url);
		ld.loadData(data.url);
	}
});

sp.defineAxis();
ld.defineAxis();

function analyzeChosenData(){

}

 /*----------------------------------------------------------------------- */
ko.applyBindings(dataViewModel);

// Should probably be located in other file
$(document).ready(function () {
	$('#menu').toggleClass('open');
	$('#menu .close').html("Hide <span class='glyphicon glyphicon-resize-small'></span>");
    $('.menu, .close').click(function () {
        $('#menu').toggleClass('open');
        if ($('#menu').hasClass("open")) {
            $('#menu .close').html("Hide <span class='glyphicon glyphicon-resize-small'></span>");

            
        } else {
            $('#menu .close').html("Show <span class='glyphicon glyphicon-resize-vertical'></span>");
        }
    })
});