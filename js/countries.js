//country
function countries(){
	var self = this;
	self.countriesViewModel = null;

	self.setCountriesViewModel = function(){
		self.countriesViewModel = new countriesViewModel();
	}

	self.init = function(){
	    var c = self.country_list;
	    for(var i=0; i<c.length;i++){
	    	self.countriesViewModel.selectedChoices.push(c[i]);
	        self.countriesViewModel.countries.push({ name: c[i], id: self.countriesViewModel.countries().length+1, isChecked: true });
	    }
	    ko.applyBindings(self.countriesViewModel, document.getElementById("countries"));
	};

	countriesViewModel = function(){
	    this.countries = ko.observableArray([]);
	    this.selectedChoices = ko.observableArray([]);
	    this.selectAll = ko.observable(true);
	    this.optionText = ko.computed(function(){
	    	if(!this.selectAll()){
	    		return "Select all countries";
	    	}
	    	else{
	    		return "Deselect all countries";
	    	}
	    }, this);
	    this.toggleActive = function(){
	    	this.selectAll(!this.selectAll());
	    	if(!this.selectAll()){
	    		//Deselect all countries
	    		this.selectedChoices([]);
	    	}
	    	else{
	    		//Select all countries
	    		this.selectedChoices(self.country_list);
	    	}	
	    	
	    }

	};
	self.getSelectedCountries = function (){
		return self.countriesViewModel.selectedChoices();
	}
	
	// countries gotten from http://www.hscripts.com/scripts/JavaScript/option/world-countries.php
	self.country_list = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
}