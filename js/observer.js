//observer
function observer(){
	var self = this;
	self.model = new ViewModel(2000,2013);

	self.sp = new sp();
	self.ld = new ld();

	glyphChangeStateArray.subscribe(function(type){
		// update graphs
		updateGraphs(type);
        console.log("INSIDE OBSERVER");
        console.log(type);
        self.model.setMinValue(1978);
        ko.applyBindings(self.model, document.getElementById("slider"));
        showYearSpan();
        moveLowerIndicator();
        moveUpperIndicator();
	});
    /* MIN YEAR SUBSCRIPTION */
    self.model.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){


        }
        
        console.log("Changed MIN year");

    });
    /* MAX YEAR SUBSCRIPTION */
    self.model.max.subscribe(function(type){
        console.log("Changed MAX year");
    });

    /* SPECIFIC YEAR SUBSCRIPTION */
    self.model.selectedYears.subscribe(function(years){
        console.log("specific years SUBSCRIPTION" + years);
    });

	function spUpdate(type){
		self.sp.data = dh.getDataSubtype(type, "");
		self.sp.defineAxis();
		self.sp.draw();
	}

    function ldUpdate(type){
        self.ld.data = dh.getDataSubtype(type, "");
        self.ld.defineAxis();
        self.ld.draw();
    }

    function updateGraphs(type){
        spUpdate(type);
        ldUpdate(type);
    }


}



//Could be stored in own class, mabye refactor?
ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        var sliderValues = ko.utils.unwrapObservable(valueAccessor());
        
        if(sliderValues.min !== undefined) {
            options.range = true;        
        }        
        
        options.slide = function(e, ui) {




            if(sliderValues.min) {
                sliderValues.min(ui.values[0]);
                sliderValues.max(ui.values[1]);   
                
            } else {
                sliderValues.value(ui.value);
            }

        };
        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).slider("destroy");
        });
        
        $(element).slider(options);


    },
    update: function (element, valueAccessor) {
        var sliderValues = ko.toJS(valueAccessor());
        console.log("update");



        if(sliderValues.min !== undefined) {
            $(element).slider("values", [sliderValues.min, sliderValues.max]);
        } else {
            $(element).slider("value", sliderValues.value);
        }        

        //Move the buttons that show the years
        moveLowerIndicator();
        moveUpperIndicator();
    }
};

ViewModel = function(minyear, maxyear) {
    var self = this;
    self.min = ko.observable(minyear);
    self.max = ko.observable(maxyear);
    self.selectedYears = ko.observableArray([]);
    self.isLowerActive = ko.observable(false); //Lower year
    self.isUpperActive = ko.observable(false); //Higher year
    self.setMinValue = function(newMinYear){
    	self.min(newMinYear);
    }
    self.setMaxValue = function(newMaxYear){
    	self.min(newMaxYear);
    }
    self.setLowerYear = function(first){
        
        if(self.isLowerActive()){        
            self.selectedYears.push(first);
            self.selectedYears.sort();
        }
        else{
            self.selectedYears.shift();
        }
        console.log(self.selectedYears());
        self.isLowerActive(!self.isLowerActive());

        //this.selectedYears([first,second]);
    }
    self.setUpperYear = function(second){
        
        if(self.isUpperActive()){            
            self.selectedYears.push(second);
            self.selectedYears.sort();
        }
        else{
            self.selectedYears.pop();
        }
        self.isUpperActive(!self.isUpperActive());
        console.log(self.selectedYears());
        //this.selectedYears([first,second]);
    }

}
//ko.applyBindings(viewModel);


function moveLowerIndicator(){
    var obj = $("#slider").find(".ui-slider-handle")[0];
    var btn = $("#yearSpecifier").find(".btn-primary")[0];
    var obj_width = $(obj).width();
    var pos = $(obj).position().left;
    var size = $(btn).width();
    pos = Math.abs(pos-size);
    if(pos<size){
        $(btn).css('left',0);
    }
    else
        $(btn).css('left',pos-2*obj_width);

}

function moveUpperIndicator(){
    var obj = $("#slider").find(".ui-slider-handle")[1];
    var btn = $("#yearSpecifier").find(".btn-primary")[1];
    var width = $("#slider").width();
    var pos = $(obj).position().left;
    var size = $(btn).width();
    $(btn).css('left',pos-size);
    var obj_width = $(obj).width();
    var pos = $(obj).position().left;
    var size = $(btn).width();
    
    var temp_pos = Math.abs(pos+size);
    if(temp_pos<=width){
        $(btn).css('left',pos-size-obj_width);
    }
    else{
        $(btn).css('left',width-3*size+2*obj_width);
    }

}

function showYearSpan(){

    $("#yearSpecifier").show();
}



