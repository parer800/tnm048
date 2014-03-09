// icon creation
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
		var typeName = this.glyphName.toLowerCase();
		if(self.isActive()){
			//Update data structure
			//Notify observer
			dh.loadData(typeName, updateSubscription);
		}
		else{

			var index = glyphChangeStateArray.indexOf(typeName);
			var empty = glyphChangeStateArray.splice(index,index+1);
		}
	};	
}

var glyphViewModel = {
	glyphs: [
		new Glyph(1,"flaticon-oil5","Oil"),
		new Glyph(2,"flaticon-wheelbarrow1","Coal"),
		new Glyph(3,"flaticon-bio1","Natural Gas"),
		new Glyph(4,"flaticon-renewable","Renewables")
	]
};


var perCapitaFlag = ko.observable(false);
var PerCapitaGlyph = function(id, str, glyphName){
	var self = this;
	self.id = id;
	self.str = str;
	self.glyphName = glyphName;
	self.isActive = ko.observable(false);
	self.toggleActive = function(data,event){
		self.isActive(!self.isActive());
		var typeName = this.glyphName.toLowerCase();
		perCapitaFlag(self.isActive());
	};	
}



var perCapitaViewModel = {
	glyphs:[new PerCapitaGlyph(1,"flaticon-group44", "Per Capita")]
};

ko.applyBindings(glyphViewModel, document.getElementById("glyphs"));
ko.applyBindings(perCapitaViewModel, document.getElementById("per-capita"));

