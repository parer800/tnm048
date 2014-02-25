function sp(){

    var self = this;
    self.xData = null;
    self.yData = null;

    var keyDown = false;
    var selectBox  = {"start" : {"startY" : 0, "startX" : 0}, "end" : {"endY" : 0, "endX" : 0}};

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

   /* $("#sp")
        .on("mousedown", function(ev) {
            keyDown = true;
            ev.preventDefault();

            //self.zoomData = [];
            $("#ld").append("<div id='selected'> </div>");
            $("#selected").css({
                'opacity': '0.6',
                'position': 'absolute',
                'border': '1px solid #89B',
                'background': '#BCE',
                'background-color': '#BEC',
                'border-color': '#8B9'
            });
            selectBox.startY = ev.pageY - $("#menu").height();
            selectBox.startX = ev.pageX;
        })
        .on("mousemove", function(ev) {
            if(keyDown){
                $("#selected").css({ 
                    top: Math.min(selectBox.startY, ev.pageY - $("#menu").height()), 
                    left: Math.min(selectBox.startX, ev.pageX), 
                    height: Math.abs( ev.pageY - $("#menu").height() - selectBox.startY ),
                    width: Math.abs( ev.pageX - selectBox.startX )
                });
            }
        })
        .on("mouseup", function(ev) {
            keyDown = false;
            ev.preventDefault();

            //if(self.zoomData.length > 0){
                //self.defineAxis(self.zoomData);
                //self.draw(self.zoomData);
            //}

            $("#selected").remove();
        });*/

    d3.select("#sp svg")
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
            
            /*if(self.zoomData.length > 0){
                self.defineAxis(self.zoomData);
                self.draw(self.zoomData);
            }*/
        });

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
            .attr("r", 3);

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
