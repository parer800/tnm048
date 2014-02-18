function dataHandler(){

	var self = this;

	self.dataTable = {};
	self.dataFiles = {};

	this.getData = function(param){

		var output = {};

		for(var i=0; i<param["type"].length; i++){
			var type = param["type"][i];
			for(var j=0; j<param["subtype"].length; j++){
				var subtype = param["subtype"][j];
				for(var k=0; k<param["country"].length; k++){
					var country = param["country"][k];
					output[country] = {};
					for(key in self.dataTable[type][subtype][country]){
						var intKey = +key;
						if(intKey >= param["interval"][0] && intKey <= param["interval"][1])
							output[country][key] = self.dataTable[type][subtype][country][key];
					}
				}
			}
		}

		return output;
	}

	this.getDataSummedInterval = function(param){

		var data = self.getData(param);
		var output = {};

		return output;
	}

	function insert(container, type, subtype, newData){

		container[type] = container[type] || {};
		container[type][subtype] = container[type][subtype] || {};

		for(var i=0; i<newData.length; i++){
			var country = newData[i]["Country"];
			container[type][subtype][country] = newData[i];
			delete container[type][subtype][country]["Country"];
		}
	}

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
		    		insert(self.dataTable, type, result[i][0], result[i][1]);
		    	
    			callback(type);
    		});
		} else {
			callback(type);
		}
	}

	///// NOT WORKING
	this.isLoaded = function(type){
		if(self.dataTable[dataFile.type] === undefined || 
		   self.dataTable[dataFile.type][dataFile.subtype] === undefined)
			return false;
		
		return true;
	}

		this.getDataType = function(type){

		return self.dataTable[type];
	}

	this.getDataSubtype = function(type, subtype){
		// Remove this
		if(type == "oil")
			subtype = "supply";
		else
			subtype = "consumption";

		////////////////////////////
		return self.dataTable[type][subtype];
	}

	this.getMinMaxYearSubtype = function(type, subtype){
		type = "oil";
		subtype = "consumption";
		var min = Infinity, max = -Infinity;

		for(key in self.dataTable[type][subtype][0]){
			if(!isNaN(key)){
				var number = +key;
				min = Math.min(min, number);
				max = Math.max(max, number);
			}
		}
		return [min, max];
	}

	this.getMinMaxYear = function(type){
		type = "oil";
		var result = [Infinity, -Infinity], tmp;

		for(key in self.dataTable[type]){
			tmp = self.getMinMaxYearSubtype(type, key);
			result[0] = Math.min(result[0], tmp[0]);
			result[1] = Math.max(result[1], tmp[1]);
		}

		return result;
	}
	////////////////

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


// OLD IMPLEMENTATIONS SAVED FOR BACKWARDS CHECKS
/*
	this.getDataSummedInterval = function(type, subtype, interval){

		var data = self.getDataSubtype(type, subtype);
		var output = {};

		for(var i=0; i<data.length; i++){
			var value = 0;
			for(key in data[i]){
				if(!isNaN(key) && !isNaN(data[i][key]) && +key >= interval[0] && +key <= interval[1]){
					value += +data[i][key];
				}
			}
		
			var tmpObj = {};
			tmpObj["value"] = value;
			tmpObj["Country"] = data[i]["Country"];
			output.push(tmpObj);
		}
		return output;
	}
*/