/**
* @solbiatialessandro
 */
import * as constants from "./constants.js"

class Building extends Phaser.GameObjects.Sprite {
  // inventory is {coal: 24, money: 15}
  constructor(scene, x, y, name, inventory, buildingText, level) {
    var imageName;
	if (typeof level == 'undefined' || level == 0){
		imageName = name 
	} else {
		imageName = name + '2'
	}
    super(scene, x, y, imageName);

	if (typeof level == 'undefined') {
		this.level = 0;
	} else {
		this.level = level;
	}

	  this.cnt = 0;
	  this.activated = false;

	this.coal_earned = [];
	  this.cpm = 0;
	
	this._scene = scene;
	this.depth = 3;
	this._scene.player.ownedBuildings.push(this)
	this.setName(name + Math.floor(Math.random()*10000));
	this.hasText = false;
	this.timer = 0;
	this.playerMemory = {}

	var trees = this._scene.grid.adjacentTrees({x: x, y: y});
	trees.forEach(tree => { tree.kill(); })
	switch(true){
		case this.isMine():
			  this.coalTradePrice = Math.random() * 3 + 1;
			  this.coalGenerationFactor = Math.random() * 3 + 1;
			  this.inventory = {coal: 0}
		      this._scene.player.log("> new mine ("+this.name+ ", level "+ this.level+ ") created, extracts "+((this.level + 1) * this.coalGenerationFactor).toFixed(2)+" coal every 5 seconds")
			  break;
		case this.isFactory():
			  this.coalGenerationFactor = 0;
			  this.coalTradePrice = Math.random() * 3 + 10;
			  this.inventory = {coal: 0}
		      this._scene.player.log("> new factory ("+this.name+ ", level "+ this.level+ ") created")
			  break;
	  }
	if (typeof buildingText != 'undefined') {
		this.hasText = true;
		this.buildingText = buildingText;
		this._setText();
	}
  }

  earn_coal(coal){
	  this.activated = true;
	  this.inventory.coal += coal
	  this.coal_earned.push({coal: coal, time: Date.now()});
  }

  coal_per_minute(){
	  return this.coal_earned
		  .filter(mt => Date.now() - mt.time < 60 * 1000)
		  .map(mt => mt.coal)
		  .reduce((a, b) => a + b, 0)
  }

  update(){
  }

  factory_coalForLevel(level){
	  return 100 * (2 ** level);
  }

  getName(){
	  return this.name;
  }

  setMemory(key, value){
	  this.playerMemory[key] = value;
  }

  getMemory(key){
	  return this.playerMemory[key];
  }

  getAvailableCoal(){
	  return this.inventory.coal;
  }

  trainPassing(train){
	  train.stopAt(this);
	  this._setText();
  }

  isMine(){
	  return this.name.includes('mine');
  }

  isFactory(){
	  return this.name.includes('factory');
  }

  getCoalMiningRate(){
	  return this.coalGenerationFactor;
  }

  _setText(){
	  // breaks if buildingText is undefined
	  var _text = "("+ this.level+ ")" + this.name + "\n";
	  /*
	  for (const [key, value] of Object.entries(this.inventory)) {
		 _text += key + ": " + Math.floor(value) + "\n"; 
	  }*/

	  if (constants.money_enabled){
		  this.coalTradePrice.toFixed(1) + "$/unit \n"; 
	  }

	  if (this.isFactory()){
		  _text += "coal: " + Math.floor(this.inventory.coal) + "/" + 
			  this.factory_coalForLevel(this.level) +  "\n";
	  } else if (this.isMine()) {
		  _text += "coal: " + Math.floor(this.inventory.coal) + "\n";
	  }
	
	  if (this.activated == false && this.isFactory()){
		this.buildingText.setStyle({ color: 'white', backgroundColor: 'grey' });
	  }
	  this.buildingText.setText(_text);
  }

  _factory_BurnCoal(){
	  // called every 5 secs
	 this.inventory.coal -= this.level + 1;
	 this._scene.player.currency += this.level + 1; 
  }

  preUpdate(time, delta){
	  super.preUpdate(time, delta);
	  this.timer += delta;
	  if (this.isFactory()){
		  this.cpm = this.coal_per_minute();
		  if (this.timer > 5000){
			  this._scene.player.log(this.name + " is receiving " + this.cpm + "coal per minute");
			  if (this.cpm > this._scene.player.cpm_target){
				  this._scene.player.log(this.name + " receiving enough coal!");
			  }
			  if(this.activated == true){
				  this._factory_BurnCoal();
			  }
		  }

		  if (this.activated == true && (this.cpm == 0 || this.inventory.coal < 10)){
			this.buildingText.setStyle({ color: 'white', backgroundColor: 'red' });
		  } else {
			  this.buildingText.setStyle({ color: 'black', backgroundColor: 'rgba(0, 0, 0, 0)' })
		  }

		  if (this.inventory.coal <= 0 && this.activated == true){
			  this._scene.player.log(this.name + " finished the coal! you lost");
			  throw "YOU LOST"
		  }
	  }
	  if (this.timer > 5000){
		  var extractedCoal = this.coalGenerationFactor * (this.level + 1);
		  this.inventory.coal += extractedCoal
		  //this._scene.player.log(">["+this.name+"] extracted "+extractedCoal+" coal.") 
		  this._setText();
		  this.timer = 0;

		  if (this.isFactory() &&
			  this.inventory.coal >= this.factory_coalForLevel(this.level)){
			  //this._scene._creator._createMines(1, this.level);
			  this.level += 1;
			  this.setTexture('factory2')
			  //this._scene.player.log(">["+this.name+"] is now a level "+this.level+" factory! It generated a level "+ (this.level - 1) + " mine")
		  }
	  }
	  

  }
}

export {Building};
