function pie(){
	var self = this;
	self.data = null; 

	var w = 300,                        
    h = 300,                           
    r = 100,                            
    color = d3.scale.category20c();     

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;
 
    var svg = d3.select("#pie")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    var arc = d3.svg.arc()             
        .outerRadius(r);
 
    var pie = d3.layout.pie()           
        .value(function(d) { return d.value[0][1]; });    
 
 	this.draw = function(){
 		
	    var arcs = svg.selectAll("g.slice")
	        .data(pie(self.data))                           
	        .enter()                          
	            .append("g")               
	                .attr("class", "slice")    
	        	.append("path")
	                .attr("fill", function(d, i) { return color(i); } ) 
	                .attr("d", arc)  
	                .on("mouseenter", function(d) {
		  				d3.select("body").append("div")   
					       .attr("class", "tooltip") 
					    d3.select(this).attr("d", d3.svg.arc().outerRadius(120));
		  			})
		  			.on("mouseout", function(d) {
		  				d3.select(".tooltip").remove();
		  				d3.select(this).attr("d", d3.svg.arc().outerRadius(100));
		  			})
		  			.on("mousemove", function(d) {
		  				var procent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;

	               		d3.select(".tooltip").html(d.data.subtype[0] + ", " + procent.toFixed(2) + "%, " + d.value)
				            .style("left", (d3.event.pageX + 20) + "px")     
				            .style("top", (d3.event.pageY) + "px");
	            	})                          
		 
	        arcs.append("text")                                     //add a label to each slice
	            .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	                d.innerRadius = 0;
	                d.outerRadius = r;
	                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	            })
	            .style("fill", "White")
      			.style("font", "bold 12px Arial")
	            //.attr("text-anchor", "middle")                          //center the text on it's origin
	            .text("hej");        //get the label from our original data array
		
	}
}