function dataHandler(){

	var self = this;

	self.dataTable = {};
	self.dataFiles = {};

	///// NOT WORKING
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
	////////


	this.loadData = function(type, callback){
	
		if(self.dataTable[type] === undefined) {
			self.dataTable[type] = {};

			var q = queue();

			for(key in self.dataFiles[type]){
				var url = self.dataFiles[type][key];

	        	q.defer(function(args, cb){
	        		d3.csv(args[1], function(error, data) {
			 			cb(error, [args[0], data]);
	        		});
	        	}, [key, url]);
			}
		    q.awaitAll(function(error, result) {
		    	for(var i=0; i<result.length; i++)
		    		self.dataTable[type][result[i][0]] = result[i][1];

    			callback(type);
    		});
		} else {
			callback(type);
		}
	}

	// OIL 
	self.dataFiles["oil"] = {};
	self.dataFiles["oil"]["supply"] = "data/Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// COAL 
	self.dataFiles["coal"] = {};
	self.dataFiles["coal"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// NATURAL GAS
	self.dataFiles["natural gas"] = {};

	// RENEWABLES
	self.dataFiles["renewables"] = {};
}


