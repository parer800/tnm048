function dataHandler(){

	var self = this;

	self.dataTable = {};

	this.isLoaded = function(dataFile){
		if(self.dataTable[dataFile.type] === undefined || 
		   self.dataTable[dataFile.type][dataFile.subtype] === undefined)
			return false;
		
		return true;
	}

	this.getData = function(dataFile){
		if(self.isLoaded)
			return self.dataTable[dataFile.type][dataFile.subtype];
	}

	this.loadData = function(dataFile, callback){
	
		if(self.dataTable[dataFile.type] === undefined)
			self.dataTable[dataFile.type] = {};

		if(self.dataTable[dataFile.type][dataFile.subtype] === undefined)
			d3.csv(dataFile.url + ".csv", function(error, data) {
		 		self.dataTable[dataFile.type][dataFile.subtype] = data;
		 		callback(dataFile); // Add dataFile to glyphChangeStateArray in glyph.js so the observer's subscription gets the information
        	});
		else
			callback(dataFile); // same as above but reuses the existing data
	}
}