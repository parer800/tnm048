//observer
function observer(){
	var self = this;



	glyphChangeStateArray.subscribe(function(changes){
		console.log("INSIDE OBSERVER");
		console.log(changes);
	});
}