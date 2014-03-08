function ld(){

    var self = this;
    self.data = null;
    self.zoomData = [];
    self.interval = [0, 0];
    self.typeViewModel = null; // DEFAULT view model, will be assigned later
    var keyDown = false;
    var selectBox  = {"start" : {"startY" : 0, "startX" : 0, "posX" : 0, "posY" : 0}, "end" : {"endY" : 0, "endX" : 0}};

    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#ld")
    	.append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    	.attr("id", "pathGroup")
        	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.select("#ld svg")
    	.on("mousedown", function() {

	    	keyDown = true;
	    	d3.event.preventDefault();

	    	var xValue = x.invert(d3.mouse(this)[0] - 80),
	  			yValue = y.invert(d3.mouse(this)[1] - 20);
	    	
	    	selectBox.start.startX = xValue;
	    	selectBox.start.startY = yValue;
	    	selectBox.start.posX = d3.event.pageX;
	    	selectBox.start.posY = d3.event.pageY - $("#menu").height();

	    	self.zoomData = [];
	    	$("#ld").append("<div id='selected'> </div>");
	    })
	    .on("mousemove", function() { 

	    	if(keyDown){
	    		$("#selected").css({ 
					top: Math.min(selectBox.start.posY, d3.event.pageY - $("#menu").height()), 
					left: Math.min(selectBox.start.posX, d3.event.pageX), 
					height: Math.abs(d3.event.pageY - $("#menu").height() - selectBox.start.posY - 5),
					width: Math.abs(d3.event.pageX - selectBox.start.posX - 5)
				});
	    	}
	    })
	    .on("dblclick", function() {
            self.defineAxis(self.data);
            self.draw(self.data);
                        
        })
	    .on("mouseup", function() { 
	    	
			keyDown = false;
			d3.event.preventDefault();

			var xValue = x.invert(d3.mouse(this)[0] - 80),
	  			yValue = y.invert(d3.mouse(this)[1] - 20);

	        $("#selected").remove(); 
	        selectBox.end.endX = xValue;
	        selectBox.end.endY = yValue;

	        findZoomData();
	    	
	        if(self.zoomData.length > 0){ 
	     		self.defineAxis(self.zoomData);
	        	self.draw(self.zoomData);
	     	}
	    });

	function findZoomData(){ 
		var maxX = Math.max(selectBox.start.startX, selectBox.end.endX),
			minX = Math.min(selectBox.start.startX, selectBox.end.endX),
			maxY = Math.max(selectBox.start.startY, selectBox.end.endY),
			minY = Math.min(selectBox.start.startY, selectBox.end.endY);

		for(var i=0; i<self.data.length; i++){
			for(var j=0; j<self.data[i].value.length; j++){

				if(self.data[i].value[j][0] >= minX && self.data[i].value[j][0] <= maxX && 
				   self.data[i].value[j][1] >= minY && self.data[i].value[j][1] <= maxY){

					self.zoomData.push(self.data[i]);
					break;
				}
			}
		}
	}

	function findMax(data) { 
		return d3.max(data, function(data) { 
	    	return d3.max(data["value"], function(data) {
	    		return data[1];
	    	});
		});
	} 

	function findMin(data) { 
		return d3.min(data, function(data) { 
	    	return d3.min(data["value"], function(data) {
	    		return data[1];
	    	});
		});
	}

	this.defineAxis = function(data){ 
        x = d3.scale.linear()
            .range([0, width])
            .domain(self.interval);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([findMin(data), findMax(data)]); 

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("d"));

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    this.draw = function(drawData)
    { 
	    //remove old stuff so it is not duplicated
	    svg.select(".x.axis").remove(xAxis);
	    svg.select(".y.axis").remove(yAxis);
		svg.selectAll(".ldpath").remove();
			 
	    // Add x axis and title.
	    svg
	        .append("g")
	            .attr("class", "x axis")
	            .attr("id", "ldXaxis")
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
	            .attr("id", "ldYaxis")
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
        	.selectAll(".ldpath")
  				.data(drawData)
  				.enter()
  			.append("path")
  				.attr("class", "ldpath")
  				.attr("d", function(data) {
  					return line(data["value"]);
  				})
	  			.attr("stroke", function(d, i) {
	  				
	  				/*if(dataMining.clusters[i] == 0)
	  					return "rgb(255, 0, 0)";
	  				else if(dataMining.clusters[i] == 1)
	  					return "rgb(0, 255, 0)";
	  				else 
	  					return "rgb(0, 0, 255)";*/

	  				return "rgb(" + 
	  						Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + ")";
	  			})
	  			.attr("fill", "none")
	  			.on("mouseenter", function(d) {
	  				d3.select(this).style("stroke-width", 7);

	  				d3.select("body").append("div")   
				       .attr("class", "tooltip")               
				       .style("opacity", 0);
	  			})
	  			.on("mouseout", function(d) {
	  				d3.select(this).style("stroke-width", 1);
	  				d3.select(".tooltip").remove();
	  			})
	  			.on("mousemove", function(d) {
	  				
	  				var xValue = Math.round(x.invert(d3.mouse(this)[0])),
	  					yValue = y.invert(d3.mouse(this)[1]);

	  				for(var i=0; i<d.value.length; i++){
	  					if(d.value[i][0] == xValue)
	  						yValue = d.value[i][1].toFixed(2);
	  				}

               		d3.select(".tooltip").html(d.country + " X: " + xValue + ", Y: " + yValue)
               			.style("opacity", .9)
			            .style("left", (d3.event.pageX + 20) + "px")     
			            .style("top", (d3.event.pageY) + "px");
            	});
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
/*	
//Temporary 
var ld_subtypes = [{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"oil"},{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"coal"},{"subtypes":[{"subtype":"import"},{"subtype":"total consumption"}],"type":"natural gas"}];
var ld_subtypes2 = [{"subtypes":[{"subtype":"import"},{"subtype":"export"},{"subtype":"total consumption"}],"type":"oil"}];
*/