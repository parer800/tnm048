//observer
function observer(){
	var self = this;

	self.slider     = new slider();
    self.sp         = new sp();
    self.ld         = new ld();
    self.subtypePie = new pie("#subPie");
    self.typePie    = new pie("#typePie");

    self.typePie.typeOfPieChart = "subtype";
    self.subtypePie.typeOfPieChart = "type";

   
    countries.setCountriesViewModel();
    
    self.slider.setSliderViewModel(2000,2011);
    var dataFilterVaules = {"type" : ["oil"], "subtype" : ["supply"], 
							"interval" : ["2000", "2012"], "country" : countries.getSelectedCountries(), 
							"sum" : {"type" : false, "subtype" : false, "interval" : false, "country" : false}};

	glyphChangeStateArray.subscribe(function(type){

        dataFilterVaules["type"] = type;

		//Check whether the sliderDOM already is bound to a view model
        if(ko.dataFor(document.getElementById("slider")) === undefined){
            self.setMinYear(2000);
            self.setMaxYear(2011);
            ko.applyBindings(self.slider.sliderViewModel, document.getElementById("slider"));
        }
        $("#container").show(); // Show the container, is hidden at page load. (this call will be dine multiple times mabye unecessary)
        showYearSpan();
        self.startCountriesSubscription();
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
        ldUpdate();
    });


    /* SP TYPE & SUBTYPE SUBSCRIPTION*/

   self.initSpSubscription =  function(){
    /*  Y AXIS */
        self.sp.typeViewModel_Y.subtype.subscribe(function(){
            //get type and subtype on format {type: "oil", subtype: "export"}
            // by calling 'self.sp.typeViewModel_Y.getSelectedType()'
            spUpdate();
        });

    /*  X AXIS */

        self.sp.typeViewModel_X.subtype.subscribe(function(){
            //get type and subtype on format {type: "oil", subtype: "export"}
            // by calling 'self.sp.typeViewModel.getSelectedType()'
            spUpdate();
        });    
        
    }

    /* PIE CHART TYPE & SUBTYPE SUBSCRIPTION */

        /* TYPE PIE  */
        pieTypeViewModel.type.subscribe(function(){
            typePieUpdate()
        });

        /* SUBTYPE PIE  */
        pieSubtypeViewModel.subtype.subscribe(function(){
            subtypePieUpdate()
        });        


    /* Per Capita Subscription */
    perCapitaFlag.subscribe(function(){
        // perCapitaFlag() for false or true
        self.updateGraphs();
    })
    
    /* COUNTRIES SUBSCRIPTION */ 

    //Call this to init countries subscription
    self.startCountriesSubscription = function(){
        countries.countriesViewModel.selectedChoices.subscribe(function(){
            // USE: self.countries.countriesViewModel.selectedChoices()
            //      To get the selected countries
            dataFilterVaules.country =countries.countriesViewModel.selectedChoices();
            self.updateGraphs();

        });
    };

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

    self.updateYearSpan = function(){
        //self.slider.updateYearSpan(aMinYear, aMaxYear);
    }

    /******************* UPDATE GRAPHS ************************/
	function spUpdate(){
		
        //Get data by y axis
        var typeSubtype = self.sp.typeViewModel_Y.getSelectedType();
        dataFilterVaules.type = [typeSubtype.type];
        dataFilterVaules.subtype = [typeSubtype.subtype];
        var data = dh.getData(dataFilterVaules);
        if(perCapitaFlag()){
            dh.normalizeData(data);
        }
        self.sp.yData = dh.sumInterval(data);
        self.sp.labels.y = dh.units[typeSubtype.type][typeSubtype.subtype];

        //Get data by x axis
        typeSubtype = self.sp.typeViewModel_X.getSelectedType();
        dataFilterVaules.type = [typeSubtype.type];
        dataFilterVaules.subtype = [typeSubtype.subtype];
        data = dh.getData(dataFilterVaules);
        if(perCapitaFlag()){
            dh.normalizeData(data);
        }
		self.sp.xData = dh.sumInterval(data);
        self.sp.labels.x = dh.units[typeSubtype.type][typeSubtype.subtype];
		
		//self.sp.data = dh.fastUnsafeMergeData(self.sp.xData, self.sp.yData);
        self.sp.data = dh.slowSafeMergeData(self.sp.xData, self.sp.yData);
		self.sp.defineAxis(self.sp.data);
		self.sp.draw(self.sp.data);
	}

	function ldUpdate(){

        var typeSubtype = self.ld.typeViewModel.getSelectedType();
        dataFilterVaules.type = [typeSubtype.type];
        dataFilterVaules.subtype = [typeSubtype.subtype];

		self.ld.data = dh.getData(dataFilterVaules);
        self.ld.interval = self.getYearSpan();

        if(self.ld.data.length > 0 && self.ld.data[0].value.length == 1){
            dh.ldOneYear(self.ld.data);
            self.ld.interval[1] = self.ld.interval[1] + 0.12;
        }
        if(perCapitaFlag()){
            dh.normalizeData(self.ld.data);
        }

        self.ld.labels.y = dh.units[dataFilterVaules.type[0]][dataFilterVaules.subtype[0]];
		self.ld.defineAxis(self.ld.data);
		self.ld.draw(self.ld.data);
	}

	function subtypePieUpdate(){
		dataFilterVaules.sum.interval = true;
		dataFilterVaules.sum.country = true;

        self.subtypePie.data = dh.getData2(dataFilterVaules);
        if(perCapitaFlag()){
            dh.normalizeData(self.subtypePie.data);
        }
        dataFilterVaules.sum.interval = false;
        dataFilterVaules.sum.country = false;
		self.subtypePie.draw();
	}

    function typePieUpdate(){
        dataFilterVaules.sum.interval = true;
        dataFilterVaules.sum.country = true;
        dataFilterVaules.type = [pieTypeViewModel.type().type]; 
        dataFilterVaules.subtype = dh.getSubtypesAsArray(pieTypeViewModel.type().type);
        self.typePie.data = dh.getData2(dataFilterVaules);
        if(perCapitaFlag()){
            dh.normalizeData(self.typePie.data);
        }
        dataFilterVaules.sum.interval = false;
        dataFilterVaules.sum.country = false;
        self.typePie.draw();
    }

	self.updateGraphs = function (){

		if(countries.countriesViewModel.selectedChoices().length > 0){
    		spUpdate();
    		ldUpdate();
    		subtypePieUpdate();
            typePieUpdate();
        }
	}

    self.notifyTypeChanged = function (types){
        //Notify graphs which types that can be chosen
        GLOBAL_TYPES = dh.getSubtypesForTypes(types);
        if(GLOBAL_TYPES.length != 0){
            self.ld.updateBinding();
            updatePieBinding();
            self.sp.updateBinding(self.initSpSubscription);

            /* hard coded solutions, we need to initialize hte subscription after we defined BOTH of the objects in sp.updateBinding.
                otherwise it will try to update the graph before the last object is defined */
            
            spUpdate();
        }
    }

    countries.init();
}

