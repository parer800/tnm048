

d3.csv("data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv", function(error, data) {
    self.data = data;
});

/* Knockout setup */
var viewModel = {
	foo : ko.observable("observer")
};

var DataFile = function (datatype, url){
	this.datatype = datatype;
	this.url = url; 
};


var dataViewModel = {
/*	self.availableData = [
		{dataFile: "Oil consumption", location: 'url_oil'},
		{dataFile: "Cole consumption", location: 'url_cole'}
	];*/
		//Skulle kunna vara 'observableArray' men vi behöver inte veta ifall filnamnen ändras eftersom de är statiska
		availableData : [
		new DataFile("oil","oil.csv"),
		new DataFile("coal","coal.csv")
	],
	selectedChoice: ko.observable() // Inget valt från början

};

/*
		Suscribe on selected data change
*/
dataViewModel.selectedChoice.subscribe(function (data){
	if(typeof data !== 'undefined'){
		console.log(data.url);
	}
});


function analyzeChosenData(){

}

function Rect(){
	var self = this;
	self.x = ko.observable(0);
	self.y = ko.observable(0);
	self.w = ko.observable(100);
	self.h = ko.observable(100);
	self.name = ko.observable(makeName());
};
function ViewModel(){
	var self = this;
	self.rects = ko.observableArray([]);
	self.addRect = function(){
		self.rects.push(new Rect(self));
	};
};
 /*----------------------------------------------------------------------- */
ko.applyBindings(dataViewModel);

 /* D3 linker */
 var rects = d3.select("#svg")
 	.selectAll(rect)
 	.data(d, function (d){ return d.name(); });

 rects.enter()
 	.append("rect")
 	.attr("id", function (d) {return d.name();});