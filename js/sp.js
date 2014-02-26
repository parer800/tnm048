function sp(){

    var self = this;
    self.zoomData = null;
    self.xData = null;
    self.yData = null;
    self.data = null;

    var keyDown = false;
    var selectBox  = {"start" : {"startY" : 0, "startX" : 0, "posX" : 0, "posY" : 0}, "end" : {"endY" : 0, "endX" : 0}};

    var x, y, xAxis, yAxis;
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    this.defineAxis = function(data) { 
       
        x = d3.scale.linear()
            .range([0, width])
            .domain([d3.min(data, function(data) { return data.value[0]; }), 
                     d3.max(data, function(data) { return data.value[0]; })]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([d3.min(data, function(data) { return data.value[1]; }), 
                     d3.max(data, function(data) { return data.value[1]; })]);

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

    d3.select("#sp svg")
        .on("mousedown", function() {

            keyDown = true;
            d3.event.preventDefault();

            var xValue = x.invert(d3.mouse(this)[0] - 80),
                yValue = y.invert(d3.mouse(this)[1] - 20);
            
            selectBox.start.startX = xValue;
            selectBox.start.startY = yValue;
            selectBox.start.posX   = d3.mouse(this)[0]  + 15;
            selectBox.start.posY   = d3.mouse(this)[1];

            self.zoomData = [];
            $("#sp").append("<div id='selected'> </div>");
        })
        .on("mousemove", function() { 

            if(keyDown){
                $("#selected").css({ 
                    top:    Math.min(selectBox.start.posY, d3.mouse(this)[1]), 
                    left:   Math.min(selectBox.start.posX, d3.mouse(this)[0] + 15 - 5), 
                    height: Math.abs(d3.mouse(this)[1] - selectBox.start.posY),
                    width:  Math.abs(d3.mouse(this)[0] + 15 - 5 - selectBox.start.posX)
                });
            }
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
            if(self.data[i].value[0] >= minX && self.data[i].value[0] <= maxX && self.data[i].value[1] >= minY && self.data[i].value[1] <= maxY){
                self.zoomData.push(self.data[i]);
            }
        }
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
            .attr("class", "dot")
            .attr("fill", "red")
            .attr("cx", function(d) {
                return +x(d["value"][0]);
            })
            .attr("cy", function(d) {
                return +y(d["value"][1]);
            })
            .attr("r", 3)
            .on("mouseenter", function(d) {
                    d3.select(this).attr("r", 7);

                    d3.select("body").append("div")   
                       .attr("class", "tooltip")               
                       .style("opacity", 0);
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("r", 3);
                    d3.select(".tooltip").remove();
                })
                .on("mousemove", function(d) {
                    d3.select(".tooltip").html(d.country + " X: " + d.value[0].toFixed(2) + ", Y: " + d.value[1].toFixed(2))
                        .style("opacity", .9)
                        .style("left", (d3.event.pageX + 20) + "px")     
                        .style("top", (d3.event.pageY) + "px");
                });

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


    /*d3.select("#sp svg")
        .on("mousedown", function() {
            keyDown = true;
            d3.event.preventDefault();

            //self.zoomData = [];
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

            //findZoomData(xValue, yValue);
            
            $("#selected").remove();
            selectBox.end.endY = d3.event.pageY - $("#menu").height();
            selectBox.end.endX = d3.event.pageX;
            
            if(self.zoomData.length > 0){
                self.defineAxis(self.zoomData);
                self.draw(self.zoomData);
            }
        });*/