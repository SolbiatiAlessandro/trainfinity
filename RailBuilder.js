/**
 * Created by Filip on 2018-05-08.
 */
import {RailSegmentFactory} from "./RailSegment.js";
import {Image} from "./Image.js";
import {ActionController} from "./ActionController.js"

class RailBuilder extends ActionController{
  constructor(grid, tileSize) {
    super(grid, tileSize);
    this.coordinateList = [];
    this.buildingSegments = [];
    this.allowBuilding = true;
  }

  /**
   * Called each time the pointer moves and returns the rail Image objects created
   * @param coordinates an object with an x and y value representing the current location of the cursor
   * @returns {Array} an array of Image objects representing rail pieces.
   */
  pointerMove(coordinates) {
    if (this.building) {
      let images = [];

      this.coordinateList = this._listCoordinatesFromStartTo(coordinates, this.tileSize);
      if (this.coordinateList.length < 2) {
        this.allowBuilding = false;
        return;
      }
      this.allowBuilding = true;
      this.buildingSegments = (new RailSegmentFactory()).fromCoordinateList(this.coordinateList);
      for (let i = 0; i < this.buildingSegments.length; i++) {
        let coordinate = this.coordinateList[i];
        let tint = 0xFFFFFF;
        let existingRailSegment = this.grid['x' + coordinate.x + 'y' + coordinate.y];
        if (this.buildingSegments[i].canBuildOn(existingRailSegment)) {
          this.buildingSegments[i] = this.buildingSegments[i].combine(existingRailSegment);
        } else {
          tint = 0xFF0000;
          this.allowBuilding = false;
        }
        images.push(new Image(coordinate.x, coordinate.y, this.buildingSegments[i].imageName,
          this.buildingSegments[i].angle, tint))
      }
      return images;
    }
  }

}

export {RailBuilder};