/**
 * Controller for placing trains
 *
 * Can only place trains on rail.
 * Does not write to the grid.
 *
 * Created by Filip on 2018-08-10.
 */

import {ActionController} from "./ActionController.js"
import {Locomotive} from "./Locomotive.js"
import {Wagon} from "./Wagon.js"

class MineBuilder {
  constructor(grid, physicsGroup, scene, level) {
    this.grid = grid
	this.physicsGroup  = physicsGroup
	this.scene = scene
	this.level = level
	this.gameObjects = []
	this.mineCost = 100;

  }


  pointerDown(position){
	  if (this.scene.player.currency < this.mineCost){
		  return;
	  }
		this.scene.player.currency -= this.mineCost;
		this.scene._creator._createMines(1);

  }

  pointerUp(){}

  pointerMove(position){
	  return []
  }

  tokill_createGameObjects() {
  }

}

export {MineBuilder};
