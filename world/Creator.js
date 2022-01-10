/**
 * Created by Filip on 2018-12-02.
 */

import * as constants from "./constants.js"
import {Water} from "./Water.js"
import {Building} from "./Building.js"

class Creator {

  constructor(game) {
    console.log(game);
    this._game = game;
    // TODO: move this to constants
    this._tileSize = constants.TILESIZE
  }

  create() {
    this._createGrass();
    this._createWater()
    this._createFactories();
    this._createMines();
  }

  _createGrass() {
    for (let x = constants.GRID_MIN_X; x < constants.GRID_MAX_X; x += this._tileSize) {
      for (let y = constants.GRID_MIN_Y; y < constants.GRID_MAX_Y; y += this._tileSize) {
        this._game.add.image(x, y, 'grass');
      }
    }
  }

  _createFactories() {
    this._createBuildings( 'factory', constants.FACTORIES)
  }

  _createMines() {
    this._createBuildings( 'mine', constants.MINES, {coal: 0})
  }

  _createBuildings(name, count, initial_inventory) {
    let roundToNearestTile = x => this._tileSize * Math.round(x / this._tileSize);
    for (let i = 0; i < count; i++) {
	  let isOnWater = true;
	  var x;
	  var y;
	  while (isOnWater) {
		  x = roundToNearestTile(Phaser.Math.RND.between(constants.GRID_MIN_X + 100, constants.GRID_MAX_X - 100));
		  y = roundToNearestTile(Phaser.Math.RND.between(constants.GRID_MIN_Y + 100, constants.GRID_MAX_Y - 100));
		  let currentBlock = this._game.grid.get({x: x, y: y});
		  if (typeof currentBlock != 'undefined' && currentBlock.name == 'water'){
			  isOnWater = true;
		  } else {
			  isOnWater = false;
		  }
	  }
	  this._createBuilding(name, x, y, initial_inventory)
    }
  }

  _createWater() {
    let baseWaterProbability = 0.03;
    let increasedProbabilityPerNeighbor = 0.45;
    let roundToNearestTile = x => this._tileSize * Math.round(x / this._tileSize);
    for (let x = roundToNearestTile(constants.GRID_MIN_X); x < constants.GRID_MAX_X; x += this._tileSize) {
      for (let y = roundToNearestTile(constants.GRID_MIN_Y); y < constants.GRID_MAX_Y; y += this._tileSize) {
        let probability = baseWaterProbability +
          increasedProbabilityPerNeighbor * this._game.grid.countAdjacentWater({x: x, y: y});
        if (Phaser.Math.RND.frac() < probability) {
          let building = new Water(this._game, x, y);
          this._game.add.existing(building);
          this._game.grid.set({x, y}, building)
        }
      }
    }
  }

  _createBuilding(name, x, y, inventory) {
	let buildingText = new Phaser.GameObjects.Text(this._game, x + constants.TILESIZE / 2, y - constants.TILESIZE / 2, name);
    let building = new Building(this._game, x, y, name, inventory, buildingText) ;
    this._game.add.existing(building);
    this._game.add.existing(buildingText);
    this._game.grid.set({x, y}, building)
  }

}

export {Creator};
