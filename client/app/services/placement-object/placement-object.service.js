class PlacementObjectService {
	constructor() {
		
	}
	overlaps (r1, r2){

		return !(r2.col >= (r1.col + r1.sizeX) || 
		           (r2.col + r2.sizeX) <= r1.col || 
		           r2.row >= (r1.row+r1.sizeY) ||
		           (r2.row+r2.sizeY) <= r1.row);
	}

	canPlace(col, row, sizeX, sizeY, placementArr) {
		var parentThis = this;

		var doTheyIntersect = false;

		var testRect = {
			col: col,
			row: row,
			sizeX: sizeX,
			sizeY: sizeY
		};

		angular.forEach(placementArr, function(existingRect){
		

			if(parentThis.overlaps(existingRect, testRect))
				doTheyIntersect = true;

		})

		return !doTheyIntersect;
	}

	getFreeSpace(sizeX, sizeY, placementArr) {
		var row = 0;
		var col = 0;

		var maxCol = 6 - sizeX;

		while(!this.canPlace(col, row, sizeX, sizeY, placementArr)) {

			if(col+1 > maxCol) {
				col = 0;
				row++;
			} else {
				col++;
			}

		}

		return {
			row: row,
			col: col,
			sizeX: sizeX,
			sizeY: sizeY
		}
	}

}
export default PlacementObjectService;