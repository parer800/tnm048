function sp(){

    var self = this;
    self.xData = null;
    self.yData = null;

    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    this.defineAxis = function() {
        x = d3.scale.linear()
            .range([0, width])
            .domain([d3.min(self.xData, function(data) { return data["value"]; }), 
                     d3.max(self.xData, function(data) { return data["value"]; })]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([d3.min(self.yData, function(data) { return data["value"]; }), 
                     d3.max(self.yData, function(data) { return data["value"]; })]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    var svg = d3.select("#sp")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function filterTest(d){

    }

    this.draw = function(data)
    { 
        //remove old plot
        svg.select(".x.axis").remove(xAxis);
        svg.select(".y.axis").remove(yAxis);
        svg.selectAll(".dot").remove();

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
            
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            /*.filter(function(d){ 
		    	var bool = true;
		    	for(key in d)
		    		if(isNaN(d[key]) && key != "Country")
		    			bool = false;
		    	return bool; 
	    	})*/
            .attr("class", "dot")
            .attr("fill", "red")
            .attr("cx", function(d) {
                return +x(d["value"][0]);
            })
            .attr("cy", function(d) {
                return +y(d["value"][1]);
            })
            .attr("r", 3);

      /*  svg.selectAll(".dot")
            .data()
            .enter()
            .append("circle")
            .filter(function(d){ 
                var bool = true;
                for(key in d)
                    if(isNaN(d[key]) && key != "Country")
                        bool = false;
                return bool; 
            })
            .attr("class", "dot")
            .attr("fill", "red")
            .attr("cx", function(d) {
                return +x(d["value"]);
            })
            .attr("cy", function(d) {
                return +y(d["value"]);
            })
            .attr("r", 3);*/

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
    };
}
