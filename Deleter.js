/**
 * Created by Filip on 2018-07-28.
 */

class Deleter {
  constructor(grid, physicsGroup, scene) {
    this.grid = grid;
	this.physicsGroup = physicsGroup;
	this.scene = scene;
	this.gameObjects = [];
  }

  pointerDown(position){
	 var toKill = this.grid.get(position);
	 if (this.grid.isRailSegment(toKill)){
		 toKill.disconnectFromAdjacentRails();
	 }
	 this.physicsGroup.remove(toKill, true, true);
	 delete this.grid._buildings['x' + position.x + 'y' + position.y];
  }

  pointerMove(position){
	  return this.gameObjects;
  }

  pointerUp(position){
  }

}


export {Deleter};
