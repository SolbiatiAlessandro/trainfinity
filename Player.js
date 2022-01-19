import * as constants from "./world/constants.js"
/**
 * @solbiatialessandro
 */
class Player {
  constructor(moneyText, moneyPMText, goalText, _game) {
	  this.money = 300;
	  this.coal_earned = [];
	  this.moneyText = moneyText;
	  this.moneyPMText = moneyPMText;
	  this.moneyText.setText("$" + this.money.toFixed(1));
	  this.moneyText.visible = false;
	  this.moneyPMText.visible = false;
	  this.goalText = goalText;
	  this._game = _game;
      this.actions = [{
        'image': 'rail',
        'controller': this._game.railBuilder,
		'quantity': -1,
		'level': 0,
      }, {
        'image': 'locomotive',
        'controller': this._game.trainBuilder,
		'quantity': 1,
		'level': 0,
      }, {
        'image': 'bomb',
        'controller': this._game.deleter,
		'quantity': -1,
		'level': 0,
      }];



	  this.level = 0;
	  this.cpm_target = 0;

	  this.create()


  }

  // initial routine to create all player related interfaces
  create(){
    this.createActionSelection();
  }

  createActionSelection() {
    let x = constants.TILESIZE;
    let y = constants.HEIGHT - constants.TILESIZE;
    for (let action of this.actions) {
      let image = this._game.add.image(x, y, action.image);
	  if (action['image'] == 'locomotive'){
	  	this._game._locomotiveBuilder = image;
	  }
      image.setScrollFactor(0);
      image.setInteractive();
      image.depth = 1000; // Always show in front
      image.on('pointerdown', () => {
        this._game.selectedActionController = action.controller;
      });
      x += constants.TILESIZE;
    }
  }


  levelUp(){
	  this.level += 1;
	  this.cpm_target += 100;
	  this.goalText.setText("⭐ Railway Engineer "+(this.level+1)+": Bring "+this.cpm_target+" units of coal/minute to the factories ⭐");
  }

  levelCompleted(cpm){
	  this._game._creator._createFactories(1);
	  this.levelUp();
	  alert("Wow! Your railway is bringing to factories "+cpm+"coal/minute! You attracted new factories to move in the valley! Also.. you are now a level "+this.level+" railway engineer, congrats! \n\n Now, can you build a railway that brings to factories "+(this.cpm_target)+" coal/minute ?");
  }

  earn_coal(coal){
	  if (this.level > 0){
		  this.coal_earned.push({coal: coal, time: Date.now()});
	  }
  }

  earn_money(money){
	  this.money += money;
	  this.moneyText.setText("$" + this.money.toFixed(1));
  }

  coal_per_minute(){
	  return this.coal_earned
		  .filter(mt => Date.now() - mt.time < 60 * 1000)
		  .map(mt => mt.coal)
		  .reduce((a, b) => a + b, 0)
  }

  update(){
	  var cpm = this.coal_per_minute().toFixed(1) ;
	  this.moneyPMText.setText("" + cpm + " coal/minute");
	  if (this.level > 0 && cpm > this.cpm_target){
		  this.levelCompleted(cpm);
	  }
  }

  log(text){
	  var div = this._game._document.getElementById('player-logs');
	  div.innerHTML += '<p class="playerlog" style="margin-bottom:0px">' + text + '</p>';
	  div.scrollTop = div.scrollHeight;
  }
}

export {Player};
