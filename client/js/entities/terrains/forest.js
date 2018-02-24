//Object defintion for forest terrain
import Terrain from './terrain.js';
let name = 'forest',
	pixelWidth = 16,
	pixelHeight = 16,
	baseWidth = 32,
	baseHeight = 32,
	pixelOffsetX = 0,
	pixelOffsetY = 0,
	buildableGrid = [1],
	passableGrid = [[1]],
	sight = 3,
	spriteImages = [{name: 'stand', count: 1}];

let forest = new Terrain(name, pixelWidth, pixelHeight, pixelOffsetX, pixelOffsetY,
	sight, spriteImages, null, buildableGrid, passableGrid, baseWidth, baseHeight);

export {forest};
