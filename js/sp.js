function sp(){

    var self = this;
    self.zoomData = null;
    self.xData = null;
    self.yData = null;
    self.data = null;
    self.typeViewModel_Y = null; // DEFAULT view model, will be assigned later
    self.typeViewModel_X = null; // DEFAULT view model, will be assigned later
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

    var svg = d3.select("#sp-content")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#sp-content svg")
        .on("mousedown", function() {
            keyDown = true;
            d3.event.preventDefault();

            var xValue = x.invert(d3.mouse(this)[0] - margin.left),
                yValue = y.invert(d3.mouse(this)[1] - margin.top);
            
            selectBox.start.startX = xValue;
            selectBox.start.startY = yValue;
            selectBox.start.posX   = d3.mouse(this)[0] - margin.left;
            selectBox.start.posY   = d3.mouse(this)[1] - margin.top;

            self.zoomData = [];

            svg.append("rect")
                .attr("id", "selected");
        })
        .on("mousemove", function() { 
 
            d3.select("#selected")
                .attr("x", function() {
                    return  Math.min(selectBox.start.posX, d3.mouse(this)[0]);
                })
                .attr("y", function() {
                    return  Math.min(selectBox.start.posY, d3.mouse(this)[1]);
                })
                .attr("width", function() {
                    return Math.abs(d3.mouse(this)[0] - selectBox.start.posX);
                })
                .attr("height", function() {
                    return Math.abs(d3.mouse(this)[1] - selectBox.start.posY);
                });
        })
        .on("dblclick", function() {
            self.defineAxis(self.data);
            self.draw(self.data);            
        })
        .on("mouseup", function() { 
            
            keyDown = false;
            d3.event.preventDefault();

            var xValue = x.invert(d3.mouse(this)[0] - margin.left),
                yValue = y.invert(d3.mouse(this)[1] - margin.top);

            d3.select("#selected").remove();
            
            selectBox.end.endX = xValue;
            selectBox.end.endY = yValue;

            findZoomData();
            
            if(self.zoomData.length > 0){
                unhighlightAll();
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

    function highlight(element){

        var selection = d3.select(element);
        
        selection
            .attr("r", 7);

          d3.selectAll(".ldpath")
            .filter(function(pathData) { 
                if(pathData.country == selection.data()[0].country){
                    return true;
                } else {
                    return false;
                }
            })
            .style("stroke-width", 7);
    }

    function unhighlight(element){

        var selection = d3.select(element);
        
        selection
            .attr("r", 3);

          d3.selectAll(".ldpath")
            .filter(function(pathData) { 
                if(pathData.country == selection.data()[0].country){
                    return true;
                } else {
                    return false;
                }
            })
            .style("stroke-width", 1);
    }

    function unhighlightAll(){

        var selection = d3.selectAll(".dot");
        
        selection
            .attr("r", 3);

        selection = d3.selectAll(".ldpath");

        selection
            .style("stroke-width", 1);
    }

    function clicked(country){
        return countries.clicked[countries.country_list.indexOf(country)];
    }

    function toggleClick(country){
        countries.clicked[countries.country_list.indexOf(country)] = !countries.clicked[countries.country_list.indexOf(country)];
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
            .attr("fill", function(d) {

                var index = countries.country_list.indexOf(d.country);

                if(index == -1){
                    return "rgb(255, 0, 0)";
                } else {
                    return countries.colors[index];
                } 
            })
            .attr("cx", function(d) {
                return +x(d["value"][0]);
            })
            .attr("cy", function(d) {
                return +y(d["value"][1]);
            })
            .attr("r", 3)
            .on("mouseenter", function(d) {

                    if(!clicked(d.country)){
                        highlight(this);
                    } 
                    
                    d3.select("body").append("div")   
                       .attr("class", "tooltip")               
                       .style("opacity", 0);
                })
                .on("mouseout", function(d) {
                    
                    if(!clicked(d.country)){
                        unhighlight(this);
                    }
                   
                    d3.select(".tooltip").remove();
                })
                .on("mousemove", function(d) {
                    d3.select(".tooltip").html(d.country + " X: " + d.value[0].toFixed(2) + ", Y: " + d.value[1].toFixed(2))
                        .style("opacity", .9)
                        .style("left", (d3.event.pageX + 20) + "px")     
                        .style("top", (d3.event.pageY) + "px");
                })
                .on("click", function(d) {

                    if(clicked(d.country)){
                        unhighlight(this);
                    } else {
                        highlight(this);
                    }
                    toggleClick(d.country);
                });
    };

    self.subtypeOption = function(){
        var self = this;
        self.type = ko.observable();
        self.subtype = ko.observable();
        self.getSelectedType = function(){
            //get type and subtype on format [{"type":theType, "subtype":theSubtype}]
            return {"type": self.type().type ,"subtype":self.subtype().subtype};
        };
    };

    self.updateBinding = function(initializeObserverSubscription){
        // RESET Y AXIS
        var element = $('#sp-controlsY')[0];
        ko.cleanNode(element);
        ko.applyBindings(self.typeViewModel_Y, document.getElementById("sp-controlsY"));
        // RESET X AXIS
        element = $('#sp-controlsX')[0];
        ko.cleanNode(element);
        ko.applyBindings(self.typeViewModel_X, document.getElementById("sp-controlsX")); 
        initializeObserverSubscription();       
    }

    self.typeViewModel_Y = new self.subtypeOption();
    self.typeViewModel_X = new self.subtypeOption();

  //  ko.applyBindings(self.typeViewModel_Y, document.getElementById("sp-controlsY"));
    self.initX = function(){
       // ko.applyBindings(self.typeViewModel_Y, document.getElementById("sp-controlsX"));
    }
}
