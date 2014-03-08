function dataMining() { 

	var self = this;
	// Data to be clustered
	self.data = null;
	// Default value for number of clusters
	self.numberOfClusters = 5;
	self.clusters;
	// Centroids
	self.centroids;

	var dataLength;

	self.calculateClusters = function(){
		var change;
		dataLength = self.data.length;
		self.clusters = [];
		self.centroids = [];

		// Randomly pick k centroids
		while(self.centroids.length < self.numberOfClusters){
			var index = Math.floor(Math.random() * self.data.length);

			if(self.centroids.indexOf(index) == -1)
				self.centroids.push(index);
		}

		do{	
			change = false;

			// Calculate the cluster for each data-point
			for(var i=0; i<dataLength; i++){
				if(self.centroids.indexOf(i) == -1){
					var minDistance = Infinity;
					for(var j=0; j<self.centroids.length; j++){
						var dist = self.calculatEuclidianDistance(self.data[i].value, self.data[self.centroids[j]].value);

						if(dist < minDistance){
							minDistance = dist;
							self.clusters[i] = j;
						}
					}
				} else {
					self.clusters[i] = self.centroids.indexOf(i);
				}
			}

			// Calculate new centroids int the clusters
			var bestCentroids = [];

			for(var j=0; j<self.numberOfClusters; j++){
				bestCentroids[j] = [0, Infinity];
			}

			for(var i=0; i<self.data.length; i++){
				var totalCost = 0;
				for(var j=0; j<self.data.length; j++){
					
					if(self.clusters[i] == self.clusters[j]){
						totalCost += self.calculatEuclidianDistance(self.data[i].value, self.data[j].value);
					}
				}
				if(bestCentroids[self.clusters[i]][1] > totalCost){
					bestCentroids[self.clusters[i]][0] = i;
					bestCentroids[self.clusters[i]][1] = totalCost;
				}
			}

			for(var i=0; i<self.centroids.length; i++){
				if(self.centroids[i] != bestCentroids[i][0]){
					self.centroids[i] = bestCentroids[i][0];
					change = true;
				}
			}
		} while(change)
	}

	self.calculatEuclidianDistance = function(data1, data2){
		var distance = 0;

		for(var i=0; i<data1.length; i++){
			distance += Math.pow((data1[i][0] - data2[i][0]), 2);
			distance += Math.pow((data1[i][1] - data2[i][1]), 2);
		}

		return Math.sqrt(distance);
	}

	self.getCountryClusters = function(){
		var output = [];
		for(var i=0; i<self.numberOfClusters; i++){
			output[i] = [];
		}

		for(var i=0; i<self.data.length; i++){
			output[self.clusters[i]].push(self.data[i].country);
		}
		return output;
	}
}