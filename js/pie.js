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
        .value(function(d) { return d["value"]; });    
 
 	this.draw = function(){
 		
	    var arcs = svg.selectAll("g.slice")
	        .data(pie(self.data))                           
	        .enter()                          
	            .append("g")               
	                .attr("class", "slice")    
	        	.append("path")
	                .attr("fill", function(d, i) { return color(i); } ) 
	                .attr("d", arc);                                
	 /*
	        arcs.append("svg:text")                                     //add a label to each slice
	                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	                //we have to make sure to set these before calling arc.centroid
	                d.innerRadius = 0;
	                d.outerRadius = r;
	                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	            })
	            .attr("text-anchor", "middle")                          //center the text on it's origin
	            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
	*/
	}
}