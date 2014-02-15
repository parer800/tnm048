//observer
function observer(){
	var self = this;
	self.sp = new sp();
	self.ld = new ld();

	glyphChangeStateArray.subscribe(function(type){
		// update graphs
		updateGraphs(type);
	});

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