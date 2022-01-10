/**
 * Created by Filip on 2018-11-05.
 */

import {TILESIZE} from "./world/constants.js"

/** Class representing a locomotive */
class Locomotive extends Phaser.GameObjects.Sprite {
  /**
   * Create a locomotive.
   * @param scene
   * @param grid
   * @param x
   * @param y
   * @param The direction the locomotive is heading, e.g. "N"
   */
  constructor(scene, grid, x, y, direction, locomotiveText) {
    super(scene, x, y, 'locomotive');
    this.grid = grid;
    this.pathProgress = 0;
    this.graphics = scene.add.graphics();
    this.path = null;
    this.previousX = x;
    this.previousY = y;
    this.direction = direction;
    this._setAngle();
    this.depth = 1;
	this.stoppedTime = 0;

	// @SolbiatiAlessandro
	this.fuel = 100;
	this.fuel_capacity = 100;
	this.hasText = false;
	if (typeof locomotiveText != 'undefined') {
		this.hasText = true;
		this.locomotiveText = locomotiveText;
	}

    this._addPathOfCurrentRail();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    //   console.log('Train entering ' + approachDirection + ' side of building at (' +
    //     this.currentBuilding.x + ',' + this.currentBuilding.y + '). Turn ' + turn);

    // Calculate pathProgress
    var speedPerMs = 0.1;
	if (this.stoppedTime > 0){
		speedPerMs = 0;
		this.stoppedTime -= delta;
		return;
	}
    let length = this.path.getLength();
    let pixelsSinceLast = speedPerMs * delta;
    let pathProgressDelta = pixelsSinceLast / length;
    this.pathProgress += pathProgressDelta;

    if (this.pathProgress < 1 && this.fuel > 0) {

	  this.fuel -= pathProgressDelta;
	  if(this.hasText){
		  if (this.fuel > 0){
			  this.locomotiveText.setText("Fuel: " + Math.floor(this.fuel));
		  } else {
			  this.locomotiveText.setText("OUT OF FUEL!");
		  }

	  }


      let vector = this.path.getPoint(this.pathProgress);
      this.previousX = this.x;
      this.previousY = this.y;
      this.setPosition(vector.x, vector.y);
	  if (this.hasText){
		  this.locomotiveText.setPosition(vector.x, vector.y);
	  }
	  if (this.grid.isBuildingAdjacent(vector)) {
		  let adjacentBuildings = this.grid.adjacentBuildings(vector);
		  adjacentBuildings.forEach(building => building.trainPassing(this))
	  }
      this._calculateDirection();
      this._setAngle();
    } else {
      this._addPathOfCurrentRail();
    }
  }

  _setAngle() {
    this.angle = {'N': 0, 'E': 90, 'S': 180, 'W': 270}[this.direction];
  }

  _addPathOfCurrentRail() {
    let position = this.grid.getPositionClosestTo(this.x, this.y);
    if (!this.grid.hasRail(position)) {
      return
    }
    let railSegment = this.grid.get(position);
    //console.log(this._direction());
    let newDirection = railSegment.newDirection(this.direction);

    //correct the current position since we might have overshot a bit
    this.x = position.x;
    this.y = position.y;

    this._addPath(newDirection);

  }

  _addPath(direction) {
    let deltas = {
      N: {dx: 0, dy: -TILESIZE},
      S: {dx: 0, dy: TILESIZE},
      W: {dx: -TILESIZE, dy: 0},
      E: {dx: TILESIZE, dy: 0}
    };
    let delta = deltas[direction];
    if (!delta) {
      throw '_addPath called with non-direction argument "' + direction + '"'
    }
    let path = new Phaser.Curves.Path(this.x, this.y);
    path.lineTo(this.x + delta.dx, this.y + delta.dy);
    //console.log('new path: dx=' + dx +', dy=' + dy);
    this.setPath(path)
  }

  _calculateDirection() {
    if (Math.abs(this.x - this.previousX) < Math.abs(this.y - this.previousY)) {
      this.direction = this.y > this.previousY ? 'S' : 'N';
    } else {
      this.direction = this.x > this.previousX ? 'E' : 'W';
    }
  }

  setPath(path) {
    this.path = path;
    this.pathProgress = 0;
    this.showPath();
  }

  showPath() {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xffffff, 1);
    //this.path.draw(this.graphics);
  }

  stopMine(mine){
	  console.log("train stopped by mine");
	  console.log(mine);
	  this.stoppedTime = 2000;
	  var received_coal = Math.min(this.fuel_capacity - this.fuel, mine.inventory.coal)
	  this.fuel += received_coal;
	  mine.inventory.coal -= received_coal;
  }

  stopFactory(factory){
	  console.log("train stopped by factory");
	  console.log(factory);
	  this.stoppedTime = 1000;
  }
}

export {Locomotive};
