//observer
function observer(){
	var self = this;
	self.model = new ViewModel(2000,2013);




	glyphChangeStateArray.subscribe(function(changes){
		console.log("INSIDE OBSERVER");
		console.log(changes);
		self.model.setMinValue(1978);
		ko.applyBindings(self.model, document.getElementById("slider"));
	});
}


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
        

    }
};

ViewModel = function(minyear, maxyear) {
    this.min = ko.observable(minyear);
    this.max = ko.observable(maxyear);
    this.setMinValue = function(newMinYear){
    	this.min(newMinYear);
    }
    this.setMaxValue = function(newMaxYear){
    	this.min(newMaxYear);
    }
}
//ko.applyBindings(viewModel);

