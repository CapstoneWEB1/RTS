//Object defintion for cannonball weapon
import Weapon from './weapon.js';
import { game } from '../../game.js';

let name = 'cannonball',
	pixelWidth = 10,
	pixelHeight = 11,
	pixelOffsetX = 5,
	pixelOffsetY = 5,
	radius = 8,
	range = 15,
	damage = 80,
	speed = 1,
	reloadTime = 20,
	spriteImages = [{name: 'fly', count: 1, directions: 8}, {name: 'explode', count: 7}],
	turnSpeed = 2;

let cannonball = new Weapon(name, pixelWidth, pixelHeight, pixelOffsetX, pixelOffsetY, radius, range, damage, speed, reloadTime, spriteImages, turnSpeed);

export {cannonball};
