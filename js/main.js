var sp1 = new sp();

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
		sp1.defineAxis();
		sp1.loadData(data.url);
	}
});

function analyzeChosenData(){

}

 /*----------------------------------------------------------------------- */
ko.applyBindings(dataViewModel);
