//Object defintion for villager unit
import {
  game
} from '../../game.js';

import Unit from './unit.js';
let name = 'villager',
  pixelWidth = 16,
  pixelHeight = 16,
  //TODO: determine Pixel Offsets
  pixelOffsetX = 0,
  pixelOffsetY = 0,
	//TODO: determine radius
	radius =  0,
  sight = 3,
  hitPoints = 150,
  cost = 50,
  spriteImages = [{name: 'alive', count: 1, directions: 4}],
	range = 1,
	moveSpeed = 1,
	interactSpeed = 1,
	firePower =  0,
	builtFrom = 'castle',
  defaults = {
    turnSpeed: 2,
    buildTime: 5,
		speedAdjustmentWhileTurningFactor: 0.5,
    // temporarily set villager's canAttack to true!!!!
    canAttack: true,
    canMove: true,
    drawSprite: function(self) {
      return function() {
        let x = this.drawingX;
        let y = this.drawingY;

        // All sprite sheets will have blue in the first row and green in the second row
        // let colorIndex = (this.team === "blue") ? 0 : 1;
        let colorIndex = 0;
        let colorOffset = colorIndex * this.pixelHeight;
        // imageOffset needs to be set from animate() function
        this.imageOffset = 0;
        // Draw the sprite at x, y
        game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth, colorOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
      }
    },
    processOrders: function() {
			this.lastMovementX = 0;
			this.lastMovementY = 0;
			if (this.orders.to){
				var distanceFromDestination = Math.pow(Math.pow(this.orders.to.x - this.x, 2)+Math.pow(this.orders.to.y - this.y, 2),0.5);
				var radius = this.radius/game.gridSize;
				// console.log(this.orders.to);

			}
			switch (this.orders.type){
				case "move":
					if (distanceFromDestination < radius){
						this.orders = {type: "stand"};
					}
					else {
						let moving = this.moveTo(this.orders.to, distanceFromDestination);

            if (!moving){
              this.orders = {type: "stand"};
            }
					}
					break;
			}

    },


  };

let villager = new Unit(name, pixelWidth, pixelHeight, pixelOffsetX, pixelOffsetY, 
	sight, hitPoints, cost, spriteImages, defaults, radius, range, moveSpeed, interactSpeed, firePower, builtFrom);

villager.defaults.drawSprite = villager.defaults.drawSprite(villager);

export {
  villager
};
