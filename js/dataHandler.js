var GLOBAL_TYPES = [{"subtypes":[{"subtype":null}] , "type":null}]; 

function dataHandler(){

	var self = this;

	self.dataTable = {};
	self.dataFiles = {};

	this.getSubtypesForTypes = function(typeArr){

		var output = [];

		for(var i=0; i<typeArr.length; i++){
			var tmp = {};
			tmp["subtypes"] = [];
			tmp["type"] = typeArr[i];

			for(subtype in self.dataTable[typeArr[i]]){
				tmp["subtypes"].push({"subtype" : subtype});
			}
			output.push(tmp);
		}
		return output;
	}

	this.getData = function(param){

		var output = [];

		for(var i=0; i<param["type"].length; i++){
			var type = param["type"][i];
			if(self.dataTable[type] === undefined)
				continue;

			for(var j=0; j<param["subtype"].length; j++){
				var subtype = param["subtype"][j];
				if(self.dataTable[type][subtype] === undefined)
					continue;
				
				for(var k=0; k<param["country"].length; k++){
					var country = param["country"][k];
					if(self.dataTable[type][subtype][country] === undefined)
						continue;
					
					var tmp = {};
					tmp["country"] = country;
					tmp["value"] = [];

					for(key in self.dataTable[type][subtype][country]){
						var intKey = +key;
						if(intKey >= param["interval"][0] && intKey <= param["interval"][1])
							tmp["value"].push([intKey, +self.dataTable[type][subtype][country][key]]);
					}
					output.push(tmp);
				}
			}
		}

		return output;
	}

	this.sumInterval = function(data){

		var output = [];
		
		for(var i=0; i<data.length; i++){
			var totalSum = 0;
			var tmp = {};
			tmp["country"] = data[i]["country"];

			for(var j=0; j<data[i]["value"].length; j++)
				totalSum += data[i]["value"][j][1];

			tmp["value"] = totalSum;
			output.push(tmp);
		}

		return output;
	}

	this.getMinMaxYear = function(param, mode){

		var globalResult = [Infinity, -Infinity];

		for(var i=0; i<param["type"].length; i++){
			var type = param["type"][i];
			for(var j=0; j<param["subtype"].length; j++){
				var subtype = param["subtype"][j];
				for(var k=0; k<param["country"].length; k++){
					var country = param["country"][k];
					var localResult = [Infinity, -Infinity];
					for(key in self.dataTable[type][subtype][country]){
						var intKey = +key;

						localResult[0] = Math.min(localResult[0], intKey);
						localResult[1] = Math.max(localResult[1], intKey);
					}
					if(mode){
						globalResult[0] = globalResult[0] == Infinity ? 
							localResult[0] : Math.max(globalResult[0], localResult[0]);
						globalResult[1] = globalResult[1] == -Infinity ? 
							localResult[1] : Math.min(globalResult[1], localResult[1]);
					} else {
						globalResult[0] = Math.min(globalResult[0], localResult[0]);
						globalResult[1] = Math.max(globalResult[1], localResult[1]);
					}
				}
			}
		}

		return globalResult;
	}

	this.getCountryList = function(type, subtype){
		var output = [];

		if(self.dataTable[type] !== undefined && self.dataTable[type][subtype] !== undefined)
			for(country in self.dataTable[type][subtype])
				output.push(country);

		return output;
	}

	this.slowSafeMergeData = function(data1, data2){
		var output = [];

		for(var i=0; i<data1.length; i++){
			var data1country = data1[i]["country"];
			var j = 0;
			
			while(j < data2.length){
				var data2country = data2[j]["country"];
				if(data1country == data2country){
					var tmp = {};
					tmp["country"] = data1country;
					tmp["value"] = [data1[i]["value"], data2[j]["value"]];
					output.push(tmp);
					break;
				}
				j++;
			}
		}
		return output;
	}

	this.fastUnsafeMergeData = function(data1, data2){
		var output = [];

		for(var i=0; i<data1.length; i++){
			var tmp = {};
			tmp["country"] = data1[i]["country"];
			tmp["value"] = [data1[i]["value"], data2[i]["value"]];
			output.push(tmp);
		}
		return output;
	}

	function insert(container, type, subtype, newData){

		container[type] = container[type] || {};
		container[type][subtype] = container[type][subtype] || {};

		for(var i=0; i<newData.length; i++){
			var country = newData[i]["Country"];
			var nanCheck = true;

			for(key in newData[i]){
				if(key != "Country" && isNaN(newData[i][key]))
					nanCheck = false;
			}
			if(nanCheck){
				container[type][subtype][country] = newData[i];
				delete container[type][subtype][country]["Country"];
			}
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

	this.isLoaded = function(type, subtype){
		if(subtype === undefined)
			if(self.dataTable[type] === undefined)
				return false;
		else
			if(self.dataTable[type] === undefined || self.dataTable[type][subtype] === undefined)
				return false;
		
		return true;
	}

	// OIL 
	self.dataFiles["oil"] = {};
	self.dataFiles["oil"]["supply"] = "data/Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// COAL 
	self.dataFiles["coal"] = {};
	self.dataFiles["coal"]["supply"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";
	//self.dataFiles["coal"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// NATURAL GAS
	self.dataFiles["natural gas"] = {};

	// RENEWABLES
	self.dataFiles["renewables"] = {};
}
