function ld(){

    var self = this;
    self.data = null;
    self.zoomData = [];
    self.interval = [0, 0];
    var keyDown = false;
    var selectBox  = {"start" : {"startY" : 0, "startX" : 0}, "end" : {"endY" : 0, "endX" : 0}};

    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#ld")
    	.append("svg")
	        //.attr("width", width + margin.left + margin.right)
	        //.attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    	.attr("id", "pathGroup")
        	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("body").append("div")   
       .attr("class", "tooltip")               
       .style("opacity", 0);

	d3.select("#ld svg")
    	.on("mousedown", function() {
	    	keyDown = true;
	    	d3.event.preventDefault();

	    	self.zoomData = [];
	    	$("#ld").append("<div id='selected'> </div>");
	    	
	    	selectBox.start.startY = d3.event.pageY - $("#menu").height();
	    	selectBox.start.startX = d3.event.pageX;
	    })
	    .on("mousemove", function() { 
	    	if(keyDown){
	    		$("#selected").css({ 
					top: Math.min(selectBox.start.startY, d3.event.pageY - $("#menu").height()), 
					left: Math.min(selectBox.start.startX, d3.event.pageX), 
					height: Math.abs(d3.event.pageY - $("#menu").height() - selectBox.start.startY - 5),
					width: Math.abs(d3.event.pageX - selectBox.start.startX - 5)
				});
	    	}
	    })
	    .on("mouseup", function() {
	    	
			keyDown = false;
			d3.event.preventDefault();

			var xValue = x.invert(d3.event.pageX),
	  			yValue = y.invert(d3.event.pageY- $("#menu").height());

	  		findZoomData(xValue, yValue);
			
	        $("#selected").remove();
	        selectBox.end.endY = d3.event.pageY - $("#menu").height();
	    	selectBox.end.endX = d3.event.pageX;
	    	
	        if(self.zoomData.length > 0){
	     		self.defineAxis(self.zoomData);
	        	self.draw(self.zoomData);
	     	}
	    });

	function findZoomData(xValue, yValue){ 
		console.log(xValue);
		console.log(yValue);
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
	  			.attr("stroke", function() {
	  				return "rgb(" + 
	  						Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + ")";
	  			})
	  			.attr("fill", "none")
	  			.on("mouseenter", function(d) {
	  				d3.select(this).style("stroke-width", 7);
	  			})
	  			.on("mouseout", function(d) {
	  				d3.select(this).style("stroke-width", 1);
	  				div
	  					.style("opacity", 0);
	  			})
	  			.on("mousemove", function(d) {
	  				
	  				var xValue = Math.round(x.invert(d3.mouse(this)[0])),
	  					yValue = y.invert(d3.mouse(this)[1]);

	  				for(var i=0; i<d.value.length; i++){
	  					if(d.value[i][0] == xValue)
	  						yValue = d.value[i][1].toFixed(2);
	  				}
	  				   
               		if(keyDown) 
               			self.zoomData.push(d);

               		div.html(d.country + " X: " + xValue + ", Y: " + yValue)
               			.style("opacity", .9)
			            .style("left", (d3.event.pageX + 20) + "px")     
			            .style("top", (d3.event.pageY) + "px");
            	});
    };
}


      /*
    $("#ld")
    	.on("mousedown", function(ev) {
	    	keyDown = true;
	    	ev.preventDefault();

	    	self.zoomData = [];
	    	$("#ld").append("<div id='selected'> </div>");
	    	$("#selected").css({
	    		'opacity': '0.6',
	    		'position': 'absolute',
				'border': '1px solid #89B',
				'background': '#BCE',
				'background-color': '#BEC',
				'border-color': '#8B9'
	    	});
	    	selectBox.start.startY = ev.pageY - $("#menu").height();
	    	selectBox.start.startX = ev.pageX;
	    })
	    .on("mousemove", function(ev) {
	    	if(keyDown){
	    		$("#selected").css({ 
					top: Math.min(selectBox.start.startY, ev.pageY - $("#menu").height()), 
					left: Math.min(selectBox.start.startX, ev.pageX), 
					height: Math.abs( ev.pageY - $("#menu").height() - selectBox.start.startY ),
					width: Math.abs( ev.pageX - selectBox.start.startX )
				});
	    	}
	    })
	    .on("mouseup", function(ev) {
			keyDown = false;
			ev.preventDefault();

	        $("#selected").remove();
	        selectBox.end.endY = ev.pageY - $("#menu").height();
	    	selectBox.end.endX = ev.pageX;

	        if(self.zoomData.length > 0){
	     		self.defineAxis(self.zoomData);
	        	self.draw(self.zoomData);
	     	}
	    });*/