function ld(){

    var self = this;
    self.data = null;
    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    this.defineAxis = function(){
        x = d3.scale.linear()
            .range([0, width]);

        y = d3.scale.linear()
            .range([height, 0]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    var svg = d3.select("body").append("svg")
        .attr("id","ld")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.loadData = function (url){
        d3.csv(url+".csv", function(error, data) {
            self.data = data;

            x.domain([2000, 2012]);
            y.domain([0, 9000]);

            //remove old axis otherwise they will be duplicated
            svg.select(".x.axis").remove(xAxis);
            svg.select(".y.axis").remove(yAxis);

            self.draw();
        });
    };

    this.draw = function()
    { 
		// create a line function that can convert data[] into x and y points
		var line = d3.svg.line()
			.x(function(d) { 
				return x(+d["key"]); 
			})
			.y(function(d) { 
				console.log(+d["value"]);
				return y(+d["value"]);
			})

			// Add an SVG element with the desired dimensions and margin.
			var graph = d3.select("#ld")
			     
			// Add x axis and title.
	        graph.append("g")
	            .attr("class", "x axis")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis)
	            .append("text")
	            .attr("class", "label")
	            .attr("x", width)
	            .attr("y", -6);
	            
	        // Add y axis and title.
	        graph.append("g")
	            .attr("class", "y axis")
	            .call(yAxis)
	           .append("text")
	            .attr("class", "label")
	            .attr("transform", "rotate(-90)")
	            .attr("y", 6)
	            .attr("dy", ".71em");
			
  			for(var i=0; i<self.data.length; i++){
	  			graph.append("svg:path")
		  			.attr("d", line(
		  				d3.entries(self.data[i]).filter(function(d) {
			  				if(isNaN(d["key"]) || isNaN(d["value"]))
			  					return false;
			  				else
			  					return true;
		  				}))
		  			)
		  			.attr("stroke", "black")
		  			.attr("fill", "none");
  			}
    };
}