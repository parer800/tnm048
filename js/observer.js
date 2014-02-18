//observer
function observer(){
	var self = this;
	self.slider = new slider();
    self.slider.setSliderViewModel(2000,2011);

	self.sp = new sp();
	self.ld = new ld();
	self.pie = new pie();

	glyphChangeStateArray.subscribe(function(type){

	
		var dataFilterVaules = {"type" : ["oil"], "subtype" : ["supply"], 
							     "interval" : ["2001", "2011"], "country" : ["Sweden"]};

		dataFilterVaules["interval"] = self.getYearSpan();

		var data = dh.getData(dataFilterVaules);
		//dh.getDataSummedInterval();

        //Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            self.setMinYear(1999);
            self.setMaxYear(2012);
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
        showYearSpan();
        moveLowerIndicator();
        moveUpperIndicator();

        //self.updateGraphs(data);
	});

    /**************** SUBSCRIPTIONS **************************/

    /* MIN YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
        }
        //changed min year subscription
        //self.slider.sliderViewModel.setLowerYear(self.slider.sliderViewModel.min());
    });
    /* MAX YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.max.subscribe(function(type){
        //changed max year subscription
    });

    /* SPECIFIC YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.selectedYears.subscribe(function(years){
    });

    /****************** RETURN FUNCTIONS***********************/

    self.getSelectedYears = function(){
        return self.slider.sliderViewModel.selectedYears();
    }
    self.getYearSpan = function(){
        return [self.slider.sliderViewModel.min(), self.slider.sliderViewModel.max()];
    }


    /******************* Set Functions ************************/
    self.setMinYear = function(minyear){
        self.slider.sliderViewModel.setMinValue(minyear);

    }

    self.setMaxYear = function(maxyear){
        self.slider.sliderViewModel.setMaxValue(maxyear);

    }

    /******************* UPDATE GRAPHS ************************/
	function spUpdate(type){
		//self.sp.data = dh.getDataSubtype(type, "");
		if(type.length == 1){
			self.sp.data = dh.getDataInterval(type, "", [2002, 2011]);
			self.sp.defineAxis();
			self.sp.draw();
		}
	}

	function ldUpdate(type){
		if(type.length == 1){
			self.ld.data = dh.getDataSubtype(type, "");
			self.ld.interval = [2002, 2011];
			self.ld.defineAxis();
			self.ld.draw();
		}
	}

	function pieUpdate(type){
		//self.pie.data = dh.getDataInterval(type, "", [2002, 2011]);
		//self.pie.draw();
	}

	self.updateGraphs = function (type){
		spUpdate(type);
		ldUpdate(type);
		pieUpdate(type);
	}
}

