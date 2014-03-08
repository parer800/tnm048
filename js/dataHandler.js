var GLOBAL_TYPES = [{"subtypes": [{"subtype": null}], "type": null}];

function dataHandler() {

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

	this.getData2 = function(param){

		var output = [];

		var typeArr = param.type;
		var subtypeArr = param.subtype;

		for(var i=0; i<typeArr.length; i++){
			if(self.dataTable[typeArr[i]] === undefined)
				continue;
			for(var j=0; j<subtypeArr.length; j++){
				if(self.dataTable[typeArr[i]][subtypeArr[j]] === undefined)
					continue;

				var data = self.getTypeSubtypeData(typeArr[i], subtypeArr[j], param);

				if(param.sum.interval) data = self.sumInterval2(data);
				if(param.sum.country ) data = self.sumCountries(data);

				for(var k=0; k<data.length; k++){
					data[k]["type"] = [typeArr[i]];
					data[k]["subtype"] = [subtypeArr[j]];
					if(!param.sum.interval && !param.sum.country){
						data[k]["country"] = [data[k]["country"]];
					}
				}
				
				output = output.concat(data);
			}
			if(param.sum.subtype) output = self.sumSubtypes(output);
		}
		if(param.sum.type) output = self.sumTypes(output);

		return output;
	}

	this.ldOneYear = function(data){
		
		for(var i=0; i<data.length; i++){
			data[i].value[1] = [];
			data[i].value[1][0] = data[i].value[0][0] + 0.12;
			data[i].value[1][1] = data[i].value[0][1];
		}
	}

	this.sumTypes = function(data){

		var output = [];

		for(var i=0; i<data.length; i++){

			var index = 0;
			
			for(; index<output.length; index++){
				var found = true;
				for(var k=0; k<output[index].type.length; k++)
					if(output[index].type[k] != data[i].type[k])
						found = false;
				if(found)
					break;
			}

			if(index > output.length-1){
				var tmp = {};
				tmp["type"] = data[i].type;
				tmp["subtype"] = [];
				tmp["country"] = [];
				tmp["value"] = [];

				for(var j=0; j<data[i].value.length; j++)
					tmp.value[j] = [0, 0];

				output.push(tmp);
			}

			for(var j=0; j<data[i].country.length; j++)
				if(output[index].country.indexOf(data[i].country[j]) == -1)
					output[index].country.push(data[i].country[j]);
			
			for(var j=0; j<data[i].subtype.length; j++)
				if(output[index].subtype.indexOf(data[i].subtype[j]) == -1)
					output[index].subtype.push(data[i].subtype[j]);

			for(var j=0; j<data[i].value.length; j++){
				output[index].value[j][0] += data[i].value[j][0];
				output[index].value[j][1] += data[i].value[j][1];
			}
		}

		return output;
	}

	this.sumSubtypes = function(data){

		var subtypes = {};
		var output = [];

		for(var i=0; i<data.length; i++){

			var subtype = data[i].subtype[0];
			if(subtypes[subtype] === undefined){
				subtypes[subtype] = {};
				subtypes[subtype]["type"] = [];
				subtypes[subtype]["value"] = [];
				subtypes[subtype]["country"] = [];

				for(var j=0; j<data[i].value.length; j++){
					subtypes[subtype].value[j] = [0, 0];
				}
			}

			if(data[i].country.length > 1)
				subtypes[subtype].country = data[i].country;
			else
				if(subtypes[subtype].country.indexOf(data[i].country[0]) == -1)
					subtypes[subtype].country.push(data[i].country[0]);

			if(subtypes[subtype].type.indexOf(data[i].type[0]) == -1)
				subtypes[subtype].type.push(data[i].type[0]);

			for(var j=0; j<data[i].value.length; j++){
				subtypes[subtype].value[j][0] += data[i].value[j][0];
				subtypes[subtype].value[j][1] += data[i].value[j][1];
			}
		}

		for(key in subtypes){
			var tmp = {};
			tmp["subtype"] = [key];
			tmp["type"] = subtypes[key].type;
			tmp["country"] = subtypes[key].country;
			tmp["value"] = subtypes[key].value;

			output.push(tmp);
		}

		return output;
	}

	this.sumCountries = function(data){

		var totalSum = [];
		var output = [];
		var countries = [];

		for(var i=0; data[0] !== undefined && i<data[0].value.length; i++){
			totalSum[i] = [0, 0];
		}

		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[i].value.length; j++){
				totalSum[j][0] += data[i].value[j][0];
				totalSum[j][1] += data[i].value[j][1];
			}
			if(data[i].country instanceof Array)
				countries = countries.concat(data[i].country);
			else
				countries.push(data[i].country);
		}
		output.push({"country" : countries, "value" : totalSum});
		return output;
	}

	this.sumInterval2 = function(data){
		
		var output = [];

		for(var i=0; i<data.length; i++){
			var totalXsum = 0,
				totalYsum = 0;

			for(var j=0; j<data[i]["value"].length; j++){
				totalXsum += data[i]["value"][j][0];
				totalYsum += data[i]["value"][j][1];
			}

			output.push({"country" : [data[i]["country"]], "value" : [[totalXsum, totalYsum]]});
		}
		return output;
	}

	this.getTypeSubtypeData = function(type, subtype, param){

		var output = [];

		for(var k=0; k<param["country"].length; k++){
			var country = param["country"][k];
			
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

	this.test = function(){
		var d1 = self.dataTable["oil"]["supply"];
		var d2 = self.dataTable["oil"]["consumption"];
		var d3 = self.dataTable["coal"]["supply"];
		var d4 = self.dataTable["coal"]["consumption"];

		var sum = 0;
		for(country in d1)
			for(year in d1[country])
				sum += +d1[country][year];

		console.log("** Total oil supply **");
		console.log(sum);

		sum = 0;
		for(country in d2)
			for(year in d2[country])
				sum += +d2[country][year];

		console.log("** Total oil consumption **");
		console.log(sum);

		sum = 0;
		for(country in d3)
			for(year in d3[country])
				sum += +d3[country][year];

		console.log("** Total coal supply **");
		console.log(sum);

		sum = 0;
		for(country in d4)
			for(year in d4[country])
				sum += +d4[country][year];

		console.log("** Total coal consumption **");
		console.log(sum);
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

	this.getDataMiningData = function(){
		var output = [];
		var tmp = {};

		for(type in self.dataTable){
			for(subtype in self.dataTable[type]){
				for(country in self.dataTable[type][subtype]){
					if(tmp[country] === undefined){
						tmp[country] = [];
					}
					
					for(year in self.dataTable[type][subtype][country]){
						if(self.dataTable[type][subtype][country][year] != ""){
							var value = +self.dataTable[type][subtype][country][year];
							tmp[country].push([+year, value]);
						}
					}
				}
			}
		}

		for(country in tmp){
			output.push({"country": country, "value": tmp[country]})
		}

		var length = {};
		for(var i=0; i<output.length; i++){
			if(length[output[i].value.length] === undefined){
				length[output[i].value.length] = 1;
			} else {
				length[output[i].value.length] += 1;
			}
		}
		var maxLength = -Infinity;

		for(key in length){
			if(length[key] > maxLength){
				maxLength = +key;
			}
		}

		for(var i=0; i<output.length; i++){
			if(output[i].value.length < maxLength){
				output.splice(i,1);
			}
		}

		return output;
	}

	/*
	// OIL 
	self.dataFiles["oil"] = {};
	self.dataFiles["oil"]["supply"] = "data/old/Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// COAL 
	self.dataFiles["coal"] = {};
	self.dataFiles["coal"]["supply"] = "data/old/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["coal"]["consumption"] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";

	// NATURAL GAS
	self.dataFiles["natural gas"] = {};

	// RENEWABLES
	self.dataFiles["renewables"] = {};*/


	// OIL
	self.dataFiles["oil"        ] = {};
	self.dataFiles["oil"        ]["supply"      ] = "data/Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"        ]["export"      ] = "data/Total_Exports_of_Refined_Petroleum_Products_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"        ]["import"      ] = "data/Total_Coal_Imports_(Thousand_Short_Tons).csv";
	self.dataFiles["oil"        ]["consumption" ] = "data/Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv";
	self.dataFiles["oil"        ]["reserves"    ] = "data/Crude_Oil_Proved_Reserves_(Billion_Barrels).csv";
	self.dataFiles["oil"        ]["production"  ] = "data/Total_Oil_Production_(Thousand_Barrels_Per_Day).csv";

	// NATURAL GAS
	self.dataFiles["naturalgas" ] = {};
	self.dataFiles["naturalgas" ]["production"  ] = "data/Dry_Natural_Gas_Production_(Billion_Cubic_Feet).csv";
	self.dataFiles["naturalgas" ]["export"      ] = "data/Exports_of_Dry_Natural_Gas_(Billion_Cubic_Feet).csv";
	self.dataFiles["naturalgas" ]["import"      ] = "data/Imports_of_Dry_Natural_Gas_(Billion_Cubic_Feet).csv";
	self.dataFiles["naturalgas" ]["consumption" ] = "data/Dry_Natural_Gas_Consumption_(Billion_Cubic_Feet).csv";
	self.dataFiles["naturalgas" ]["reserves"    ] = "data/Proved_Reserves_of_Natural_Gas_(Trillion_Cubic_Feet).csv";

	// INDICATORS
	self.dataFiles["indicators" ] = {};
	self.dataFiles["indicators" ]["population"  ] = "data/Population_(Millions).csv";
	
	// ELECTRICITY
	self.dataFiles["electricity"] = {};
	self.dataFiles["electricity"]["export"      ] = "data/Total_Electricity_Exports_(Billion_Kilowatthours).csv";
	self.dataFiles["electricity"]["import"      ] = "data/Total_Electricity_Imports_(Billion_Kilowatthours).csv";
	self.dataFiles["electricity"]["production"  ] = "data/Total_Primary_Energy_Production_(Quadrillion_Btu).csv";
	self.dataFiles["electricity"]["consumption "] = "data/Total_Electricity_Net_Consumption_(Billion_Kilowatthours).csv";
	self.dataFiles["electricity"]["capacity"    ] = "data/Total_Electricity_Installed_Capacity_(Million_Kilowatts).csv";
	self.dataFiles["electricity"]["carbonDioxid"] = "data/Total_Carbon_Dioxide_Emissions_from_the_Consumption_of_Energy_(Million_Metric_Tons).csv";
	
	// COAL
	self.dataFiles["coal"       ] = {};
	self.dataFiles["coal"       ]["export"      ] = "data/Total_Coal_Exports_(Thousand_Short_Tons).csv";
	self.dataFiles["coal"       ]["import"      ] = "data/Total_Coal_Imports_(Thousand_Short_Tons).csv";
	self.dataFiles["coal"       ]["consumption" ] = "data/Total_Coal_Consumption_(Thousand_Short_Tons).csv";
	self.dataFiles["coal"       ]["production"  ] = "data/Total_Primary_Coal_Production_(Thousand_Short_Tons).csv";
	
	// RENEWABLE
	self.dataFiles["renewable"  ] = {};
	self.dataFiles["renewable"  ]["consumption" ] = "data/Total_Renewable_Electricity_Net_Consumption_(Billion_Kilowatthours).csv";
	
}
