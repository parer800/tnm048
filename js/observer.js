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
							    "interval" : ["2001", "2011"], "country" : ["Sweden", "Canada"]};

		//dataFilterVaules["interval"] = self.getYearSpan();
		dataFilterVaules["country"] = dh.getCountryList(dataFilterVaules["type"], dataFilterVaules["subtype"]);
		dataFilterVaules["type"] = [type];
		var data = dh.getData(dataFilterVaules);

        //Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            self.setMinYear(1999);
            self.setMaxYear(2012);
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
        showYearSpan();

        self.updateGraphs(data);
	});

    /**************** SUBSCRIPTIONS **************************/

    /* MIN YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
            // the slider is defined
        }

        //changed min year subscription
        //self.slider.sliderViewModel.setLowerYear(self.slider.sliderViewModel.min());
    });
    /* MAX YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.max.subscribe(function(type){
        //changed max year subscription
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
            // the slider is defined
        }        
        
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
	function spUpdate(data){
		/*var xChange = true; var yChange = false;

		if(xChange)
			self.sp.xData = dh.sumInterval(data);
		if(yChange)
			self.sp.yData = dh.sumInterval(data);*/

		self.sp.xData = dh.sumInterval(data);
		self.sp.yData = dh.sumInterval(data);
		self.sp.defineAxis();
		self.sp.draw(dh.fastUnsafeMergeData(self.sp.xData, self.sp.yData));
	}

	function ldUpdate(data){
		
		self.ld.data = data;
		self.ld.interval = [2001, 2011];
		self.ld.defineAxis();
		self.ld.draw();
	}

	function pieUpdate(data){
		self.pie.data = dh.sumInterval(data);
		self.pie.draw();
	}

	self.updateGraphs = function (data){
		spUpdate(data);
		ldUpdate(data);
		pieUpdate(data);
	}
}

