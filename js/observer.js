//observer
function observer(){
	var self = this;
	self.slider = new slider();
    self.slider.setSliderViewModel(2000,2013);

	self.sp = new sp();
	self.ld = new ld();

	glyphChangeStateArray.subscribe(function(type){
		// update graphs
		updateGraphs(type);
        console.log("INSIDE OBSERVER");
        console.log(type);
        self.slider.sliderViewModel.setMinValue(1978);
        //Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
        showYearSpan();
        moveLowerIndicator();
        moveUpperIndicator();
	});

    /**************** SUBSCRIPTIONS **************************/

    /* MIN YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){


        }
        
        console.log("Changed MIN year");

    });
    /* MAX YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.max.subscribe(function(type){
        console.log("Changed MAX year");
    });

    /* SPECIFIC YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.selectedYears.subscribe(function(years){
        console.log("specific years SUBSCRIPTION" + years);
    });



    /******************* UPDATE GRAPHS ************************/

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





