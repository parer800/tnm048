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

