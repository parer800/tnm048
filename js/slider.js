//Slider functionality
function slider(){
	var self = this;
	self.sliderViewModel = null;

	self.setSliderViewModel = function(firstYear, secondYear){
		self.sliderViewModel = new SliderViewModel(firstYear,secondYear);

	}


/************** KNOCKOUT JS SETUP BINDING HANDLERS AND CREATING VIEW MODEL *****************/

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

        if(sliderValues.min !== undefined) {
            $(element).slider("values", [sliderValues.min, sliderValues.max]);
        } else {
            $(element).slider("value", sliderValues.value);
        }
       /* self.sliderViewModel.setLowerYear(sliderValues.min);
        self.sliderViewModel.setUpperYear(sliderValues.max);         
*/
        //Move the buttons that show the years
        moveLowerIndicator();
        moveUpperIndicator();


    }
};


	SliderViewModel = function(minyear, maxyear) {
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
	    	self.max(newMaxYear);
	    }
	    self.setLowerYear = function(first){
	        if(self.isLowerActive()){        
	            self.selectedYears.push(first);
	            self.selectedYears.sort();
	        }
	        else{
	            self.selectedYears.shift();
	        }

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
	        //this.selectedYears([first,second]);
	    }

	}
	/**************************************************************************/

} //*********************** END OF SLIDER CLASS ********************************/


/***************** loose gui functions in use *******************************/

function moveLowerIndicator(){
    var obj = $("#slider").find(".ui-slider-handle")[0];
    var btn = $("#yearSpecifier").find(".btn-primary")[0];
    var obj_width = $(obj).width();
    var pos = $(obj).position().left;
    var size = $(btn).width();
    pos = Math.abs(pos-size);
    if(pos<size){
        $(btn).css('left',0 + obj_width);
    }
    else
        $(btn).css('left',pos-obj_width);

}

function moveUpperIndicator(){
    var obj = $("#slider").find(".ui-slider-handle")[1];
    var btn = $("#yearSpecifier").find(".btn-primary")[1];
    var width = $("body").width();
    
    var pos = $(obj).position().left;
    var size = $(btn).width();
    var obj_width = $(obj).width();
    var temp_pos = Math.abs(pos+size);
    
    if(temp_pos>=width){
        $(btn).css('left',pos-2*(size+obj_width));
    }
    else{
        $(btn).css('left',pos-size);
    }

}

function showYearSpan(){

    $("#yearSpecifier").show();
    moveUpperIndicator();
    moveLowerIndicator();
}