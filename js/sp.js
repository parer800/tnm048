function sp(){

    var self = this;
    var xkey = "2000";
    var ykey = "2001";

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    // Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv
    // Total_Petroleum_Consumption_(Thousand_Barrels_Per_Day).csv
    d3.csv("data/Total_Oil_Supply_(Thousand_Barrels_Per_Day).csv", function(error, data) {
        self.data = data;
        //define the domain of the scatter plot axes
        x.domain([-200, d3.max(self.data, function(data) { return +data[xkey]; })+200]);
        y.domain([-200, d3.max(self.data, function(data) { return +data[ykey]; })+200]);

        draw();

    });

    function draw()
    { 
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6);
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");
            
        // Add the scatter dots.
         var p = svg.selectAll(".dot")
            .data(self.data, function(d) { return d["Country"]; });

            p.enter()
            .append("circle")
            .filter(function(d){ 
		    	var bool = true;
		    	for(key in d)
		    		if(isNaN(d[key]) && key != "Country")
		    			bool = false;
		    	return bool; 
	    	})
            .attr("class", "dot")
            .attr("fill", function(d) {
            	if(d["Country"] == "United States")
            		return "blue";
            	else
            		return "red";
            })
            .attr("cx", function(d) {
                return +x(d[xkey]);
            })
            .attr("cy", function(d) {
                return +y(d[ykey]);
            })
            .attr("r", 3);

            p
                .exit()
                .remove();

        // How do you change font size? 
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("income per capita (kr)")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", 40)
            .attr("y", 0)
            .text("Employment rate (%)")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px");
    }
}
