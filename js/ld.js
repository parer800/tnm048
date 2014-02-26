function ld(){

    var self = this;
    self.data = null;
    self.interval = [0, 0];
    self.subTypeData = ["Import","Export", "Total Consumption"];
    self.subTyeDefault = 2;
    self.typeViewModel = null;

    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#ld")
    	.append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.selectAll(".ld-filter-button").on("change", function(){console.log(this.value);})   	

	function findMax() { 
		return d3.max(self.data, function(data) { 
	    	return d3.max(data["value"], function(data) {
	    		return data[1];
	    	});
		});
	}

	function findMin() { 
		return d3.min(self.data, function(data) { 
	    	return d3.min(data["value"], function(data) {
	    		return data[1];
	    	});
		});
	}

	this.defineAxis = function(){
        x = d3.scale.linear()
            .range([0, width])
            .domain(self.interval);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([findMin(), findMax()]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("d"));

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    this.draw = function()
    { 
	    //remove old stuff so it is not duplicated
	    svg.select(".x.axis").remove(xAxis);
	    svg.select(".y.axis").remove(yAxis);
		svg.selectAll("path").remove();

	    // Add x axis and title.
	    svg
	        .append("g")
	            .attr("class", "x axis")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis)
	        .append("text")
	            .attr("class", "label")
	            .attr("x", width)
	            .attr("y", -6);
	            
	    // Add y axis and title.
	    svg
	        .append("g")
	            .attr("class", "y axis")
	            .call(yAxis)
	        .append("text")
	            .attr("class", "label")
	            .attr("transform", "rotate(-90)")
	            .attr("y", 6)
	            .attr("dy", ".71em");
			
	    var line = d3.svg.line()
			.x(function(data) { 
				return x(data[0]); 
			})
			.y(function(data) { 
				return y(data[1]);
			})


	    svg
        	.selectAll("path")
  				.data(self.data)
  				.enter()
  			.append("path")
  				.attr("d", function(data) {
  					return line(data["value"]);
  				})
	  			.attr("stroke", function() {
	  				return "rgb(" + 
	  						Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + ")";
	  			})
	  			.on("mouseover",function(){
					d3.select(this)
						.style("stroke","#FFD700");
					})
	  			.attr("fill", "none");
    };

    self.updateSubtypes = function(){

    };

    /* KNOCKOUT JS INITIALIZATION FOR CHOSING SUBTYPE */
    self.subtypeOption = function(){
    	var self = this;
    	self.type = ko.observable();
    	self.subtype = ko.observable();
    	self.getSelectedType = function(){
    		//get type and subtype on format [{"type":theType, "subtype":theSubtype}]
    		return {"type": self.type().type ,"subtype":self.subtype().subtype};
    	};
    };

    self.updateBinding = function(){
    	var element = $('#ld-controls')[0];
    	ko.cleanNode(element);
    	ko.applyBindings(self.typeViewModel, document.getElementById("ld-controls"));
    }

    self.typeViewModel = new self.subtypeOption();
    ko.applyBindings(self.typeViewModel, document.getElementById("ld-controls"));



}	
	//Temporary 
	var ld_subtypes = [{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"oil"},{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"coal"},{"subtypes":[{"subtype":"import"},{"subtype":"total consumption"}],"type":"natural gas"}];
	var ld_subtypes2 = [{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"oil"}];
	


    