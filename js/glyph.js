// icon creation
var DataFile = function (datatype, url){
	this.datatype = datatype;
	this.url = url; 
};
var glyphChangeStateArray = ko.observableArray([]);

function updateSubscription(name){
	glyphChangeStateArray.push(name);

}


var Glyph = function(id, str, glyphName){
	var self = this;
	self.id = id;
	self.str = str;
	self.glyphName = glyphName;
	self.isActive = ko.observable(false);
	self.toggleActive = function(data,event){
		self.isActive(!self.isActive());
		if(self.isActive()){
			console.log(this.glyphName);
			//loadData(this.glyphName, updateSubscription):
			//Update data structure
			//Notify observer
			dh.loadData(this.glyphName, updateSubscription);
		}
		else{

			var index = glyphChangeStateArray.indexOf(this.glyphName);
			var empty = glyphChangeStateArray.splice(index,index+1);
		}

		
		
		};

	//self.isActive.subscribe(function (value){ console.log("changed value");});		
}




var glyphViewModel = {
	glyphs: [
		new Glyph(1,"flaticon-oil5","Oil"),
		new Glyph(2,"flaticon-wheelbarrow1","Coal"),
		new Glyph(3,"flaticon-bio1","Natural Gas"),
		new Glyph(4,"flaticon-renewable","Renewables")
	]
};



ko.applyBindings(glyphViewModel, document.getElementById("glyphs"));


