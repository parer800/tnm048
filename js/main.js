var sp1 = new sp();
loadData();
/*

var viewModel = {
	foo : ko.observable("observer")
};

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

 var rects = d3.select("#svg")
 	.selectAll(rect)
 	.data(d, function (d){ return d.name(); });

 rects.enter()
 	.append("rect")
 	.attr("id", function (d) {return d.name();});
*/
var dataTable = {};

function loadData() {

	d3.csv("data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv", function(error, data) {
		mergeData(data);
	});
}

function mergeData(data) { 
	for(var i=0; i<data.length; i++){
		dataTable[i]["Country"] = data[i]["Country"];
		console.log(data[i]["Country"]);
	}

	console.log(dataTable);
	dataTable = data;
}