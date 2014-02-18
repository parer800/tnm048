//observer
function observer(){
	var self = this;
	self.sp = new sp();
	self.ld = new ld();
	self.pie = new pie();

	glyphChangeStateArray.subscribe(function(type){
		// update graphs

		self.updateGraphs(type);
		var testVar = dh.getData({"type" : ["oil"], "subtype" : ["supply"], 
					"interval" : ["2001", "2011"], "country" : ["Sweden"]});
		console.log(testVar);
	});

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
		self.pie.data = dh.getDataInterval(type, "", [2002, 2011]);
		self.pie.draw();
	}

	self.updateGraphs = function (type){
		spUpdate(type);
		ldUpdate(type);
		pieUpdate(type);
	}
}