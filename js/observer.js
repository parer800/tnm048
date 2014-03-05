//observer
function observer(){
	var self = this;

	self.slider     = new slider();
    self.sp         = new sp();
    self.ld         = new ld();
    self.subtypePie = new pie();

    self.slider.setSliderViewModel(2000,2011);
    var dataFilterVaules = {"type" : ["oil"], "subtype" : ["supply"], 
							"interval" : ["2000", "2012"], "country" : ["Sweden", "Canada", "Norway"], 
							"sum" : {"type" : false, "subtype" : false, "interval" : false, "country" : false}};

	glyphChangeStateArray.subscribe(function(type){

        dataFilterVaules["type"] = type;
        //dataFilterVaules["interval"] = self.getYearSpan();
        dataFilterVaules["country"] = dh.getCountryList(dataFilterVaules["type"][0], dataFilterVaules["subtype"]);

		//Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            self.setMinYear(2000);
            self.setMaxYear(2011);
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
       
        //self.updateGraphs();

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
    //get type and subtype on format {type: "oil", subtype: "export"}
    // by calling 'self.ld.typeViewModel.getSelectedType()'
    self.ld.typeViewModel.subtype.subscribe(function(){

        var typeSubtype = self.ld.typeViewModel.getSelectedType();
        dataFilterVaules.type = [typeSubtype.type];
        dataFilterVaules.subtype = [typeSubtype.subtype];

        ldUpdate();
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
	function spUpdate(){
		var data = dh.getData(dataFilterVaules);
		self.sp.xData = dh.sumInterval(data);
		self.sp.yData = dh.sumInterval(data);
		self.sp.data = dh.fastUnsafeMergeData(self.sp.xData, self.sp.yData);
		self.sp.defineAxis(self.sp.data);
		self.sp.draw(self.sp.data);
	}

	function ldUpdate(){

		self.ld.data = dh.getData(dataFilterVaules);
        self.ld.interval = self.getYearSpan();

        if(self.ld.data[0].value.length == 1){
            dh.ldOneYear(self.ld.data);
            self.ld.interval[1] = self.ld.interval[1] + 0.12;
        }
		
		self.ld.defineAxis(self.ld.data);
		self.ld.draw(self.ld.data);

	}

	function subtypePieUpdate(){
		dataFilterVaules.sum.interval = true;
		dataFilterVaules.sum.country = true;
		dataFilterVaules.sum.subtype = true;
        self.subtypePie.data = dh.getData2(dataFilterVaules);
        dataFilterVaules.sum.interval = false;
        dataFilterVaules.sum.country = false;
        dataFilterVaules.sum.subtype = false;
		self.subtypePie.draw();
	}

	self.updateGraphs = function (){
		
		//spUpdate();
		ldUpdate();
		subtypePieUpdate();
	}

    self.notifyTypeChanged = function (types){
        //Notify graphs which types that can be chosen
        GLOBAL_TYPES = dh.getSubtypesForTypes(types);
        if(GLOBAL_TYPES.length != 0)
            self.ld.updateBinding();
    }
}

