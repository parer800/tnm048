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

/*
        //Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
        showYearSpan();
        moveLowerIndicator();
        moveUpperIndicator();*/

        self.updateGraphs(data);
	});

    /**************** SUBSCRIPTIONS **************************/

    /* MIN YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
        }
        //self.slider.sliderViewModel.setLowerYear(self.slider.sliderViewModel.min());
    });
    /* MAX YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.max.subscribe(function(type){
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

