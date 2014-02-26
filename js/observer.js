//observer
function observer(){
	var self = this;
	self.slider = new slider();
    self.slider.setSliderViewModel(2000,2011);

    var dataFilterVaules = {"type" : ["oil"], "subtype" : ["supply"], 
							"interval" : ["2001", "2011"], "country" : ["Sweden", "Canada", "Norway"]};

	self.sp = new sp();
	self.ld = new ld();
	self.pie = new pie();

	glyphChangeStateArray.subscribe(function(type){

        dataFilterVaules["type"] = type;
        //dataFilterVaules["interval"] = self.getYearSpan();
        dataFilterVaules["country"] = dh.getCountryList(dataFilterVaules["type"], dataFilterVaules["subtype"]);

		//Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            self.setMinYear(2000);
            self.setMaxYear(2012);
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
       
        self.updateGraphs();

        showYearSpan();
        self.notifyTypeChanged(type);
	});

    /**************** SUBSCRIPTIONS **************************/

    /* SLIDER MIN YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.min.subscribe(function(type){
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
            dataFilterVaules["interval"] = self.getYearSpan();
            self.updateGraphs();
        }
    });
    /* SLIDER MAX YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.max.subscribe(function(type){
        //changed max year subscription
        if($("#slider").find(".ui-slider-handle")[0] !== undefined){
            dataFilterVaules["interval"] = self.getYearSpan();
            self.updateGraphs();
        }        
    });

    /* SLIDER SPECIFIC YEAR SUBSCRIPTION */
    self.slider.sliderViewModel.selectedYears.subscribe(function(years){
    });


    /* LD TYPE & SUBTYPE SUBSCRIPTION*/
    self.ld.typeViewModel.subtype.subscribe(function(){
        //get type and subtype on format {type: "oil", subtype: "export"}
        // by calling 'self.ld.typeViewModel.getSelectedType()'
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
		self.sp.data = dh.fastUnsafeMergeData(self.sp.xData, self.sp.yData);
		self.sp.defineAxis(self.sp.data);
		self.sp.draw(self.sp.data);
	}

	function ldUpdate(data){
		
		self.ld.data = data;
		self.ld.interval = self.getYearSpan();
		self.ld.defineAxis(self.ld.data);
		self.ld.draw(self.ld.data);
	}

	function pieUpdate(data){
		self.pie.data = dh.sumInterval(data);
		self.pie.draw();
	}

	self.updateGraphs = function (){
		var data = dh.getData(dataFilterVaules);

		spUpdate(data);
		ldUpdate(data);
		pieUpdate(data);
	}

    self.notifyTypeChanged = function (types){
        //Notify graphs which types that can be chosen
        GLOBAL_TYPES = dh.getSubtypesForTypes(types);
        if(GLOBAL_TYPES.length != 0)
            self.ld.updateBinding();
    }


}

