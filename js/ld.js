function ld(){

    var self = this;
    self.data;
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

	/*function findMax() {
		return d3.max(self.data, function(d) { 

	    	var max = -Infinity;
	    	for(key in d)
	    		if(key != "Country" && +d[key] > max)
	    			max = +d[key];

	    	return max;
		})
	}*/

	var findMax = function() {
		return d3.max(self.data, function(d) { 

	    	var max = -Infinity;
	    	for(key in d)
	    		if(key != "Country" && +d[key] > max)
	    			max = +d[key];

	    	return max;
		})
	}

	this.defineAxis = function(){
        x = d3.scale.linear()
            .range([0, width]);

        y = d3.scale.linear()
            .range([height, 0]);

        // Change the coding of the x domain
        x.domain([2000, 2012]);
        y.domain([0, findMax()]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    this.loadData = function (url){
        d3.csv(url+".csv", function(error, data) {
            self.data = data;

            // Change the coding of the x domain
            //x.domain([2000, 2012]);
            //y.domain([0, findMax()]);

            self.draw();
        });
    };

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
			.x(function(d) { 
				return x(+d["key"]); 
			})
			.y(function(d) { 
				return y(+d["value"]);
			})

	    svg
        	.selectAll("path")
  				.data(self.data)
  				.enter()
  			.append("path")
  				// Possible to find a better solution
  				.attr("d", function(dd) { 	
  					return line(
		  				d3.entries(dd).filter(function(d) {
			  				if(isNaN(d["key"]) || isNaN(d["value"]))
			  					return false;
			  				else
			  					return true;
		  				}));}
	  			)
	  			// Temporary using random colors
	  			.attr("stroke", function() {
	  				return "rgb(" + 
	  						Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + "," +
	  				        Math.floor(Math.random() * 254) + ")";
	  			})
	  			// Maby dissable in .css
	  			.attr("fill", "none");
    };
}