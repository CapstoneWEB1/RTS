//Object defintion for barrack building
import Building from './building.js';
let name = 'barrack',
	//TODO: determine building sizes
	pixelWidth = 0,
	pixelHeight = 0,
	//TODO: determine base proportions
	baseWidth = 0,
	baseHeight = 0,
	//TODO: determine base offset
	pixelOffsetX = 0,
	pixelOffsetY = 0,
	//TODO: determine grid dimensions
	buildableGrid = 0,
	passableGrid = 0,
	sight = 3,
	hitPoints = 2000,
	cost = 500,
	//TODO: get images for barrack
	spriteImages = null,
	defaults = {
		buildTime: 20,
		drawSprite: function(){
			console.log("drawing from barrack")
		}
	};

let barrack = new Building(name, pixelWidth, pixelHeight, pixelOffsetX, pixelOffsetY,
	sight, hitPoints, cost, spriteImages, defaults, buildableGrid, passableGrid, baseWidth, baseHeight);

export {barrack};
