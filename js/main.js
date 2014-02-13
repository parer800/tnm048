
var sp1 = new sp();

/* Knockout setup */
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
		console.log(data.url);
		
		sp1.loadData(data.url);
		
	}
});
sp1.defineAxis();

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
        	$('#energy-sources').show();
            $('#menu .close').html("Hide <span class='glyphicon glyphicon-resize-small'></span>");

            
        } else {
        	$('#energy-sources').hide();
            $('#menu .close').html("Show <span class='glyphicon glyphicon-resize-vertical'></span>");
        }
    })
});
