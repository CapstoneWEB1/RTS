import {
  game
} from './game.js';
import {
  resourcebar
} from './resourcebar.js';

var mouse = {
  init: function() {
    let canvas = document.getElementById("gameforegroundcanvas");
    canvas.addEventListener("mousemove", mouse.mousemovehandler, false);
    canvas.addEventListener("mouseenter", mouse.mouseenterhandler, false);
    canvas.addEventListener("mouseout", mouse.mouseouthandler, false);
    canvas.addEventListener("mousedown", mouse.mousedownhandler, false);
    canvas.addEventListener("mouseup", mouse.mouseuphandler, false);
    canvas.addEventListener("contextmenu", mouse.mouserightclickhandler, false);
    mouse.canvas = canvas;
    mouse.pannable = false;
  },
  x: 80,
  y: 80,

  gameX: 0,
  gameY: 0,

  gridX: 0,
  gridY: 0,

  calculateGameCoordinates: function() {
    mouse.gameX = game.offsetX + mouse.x;
    mouse.gameY = game.offsetY + mouse.y;

    mouse.gridX = Math.floor(mouse.gameX / game.gridSize);
    mouse.gridY = Math.floor(mouse.gameY / game.gridSize);
  },

  setCoordinates: function(clientX, clientY) {
    let offset = mouse.canvas.getBoundingClientRect();

    mouse.x = (clientX - offset.left) / game.scale;
    mouse.y = (clientY - offset.top) / game.scale;
    mouse.calculateGameCoordinates();
  },

  insideCanvas: false,

  mousemovehandler: function(ev) {
    mouse.insideCanvas = true;
    mouse.setCoordinates(ev.clientX, ev.clientY);
    mouse.checkIfDragging();
  },
  // Is the player is dragging and selecting with the left mouse button pressed
  dragSelect: false,
  // If the mouse is dragged more than this, assume the player is trying to select something
  dragSelectThreshold: 5,

  checkIfDragging: function() {
    if (mouse.buttonPressed && !resourcebar.deployBuilding) {
      // If the mouse has been dragged more than threshold treat it as a drag
      if ((Math.abs(mouse.dragX - mouse.gameX) > mouse.dragSelectThreshold && Math.abs(mouse.dragY - mouse.gameY) > mouse.dragSelectThreshold)) {
        mouse.dragSelect = true;
      }
    } else {
      mouse.dragSelect = false;
    }
  },

  mouseenterhandler: function() {
    mouse.insideCanvas = true;
  },

  mouseouthandler: function() {
    mouse.insideCanvas = true;
  },

  buttonPressed: false,
  mousedownhandler: function(ev) {
    mouse.insideCanvas = true;
    mouse.setCoordinates(ev.clientX, ev.clientY);

    if (ev.button === 0) { // Left mouse button was pressed
      mouse.buttonPressed = true;

      mouse.dragX = mouse.gameX;
      mouse.dragY = mouse.gameY;

      // ev.preventDefault();
    }
    // Middle mouse button was pressed
    if (ev.button === 1) {
      mouse.pannable = true;
    }
  },
  mouseuphandler: function(ev) {
    //console.log("button is up");

    mouse.setCoordinates(ev.clientX, ev.clientY);

    let shiftPressed = ev.shiftKey;

    if (ev.button === 0) { // Left mouse button was released
      if (mouse.dragSelect) {
        // If currently drag-selecting, attempt to select items with the selection rectangle

        mouse.finishDragSelection(shiftPressed);
      } else {
        // If not dragging, treat this as a normal click once the mouse is released
        mouse.leftClick(shiftPressed);
      }

      mouse.buttonPressed = false;

      // ev.preventDefault();
    }
    if (ev.button === 1) {
      mouse.pannable = false;
    }
  },
  finishDragSelection: function(shiftPressed) {
    if (!shiftPressed) {
      // If shift key is not pressed, clear any previosly selected items
      game.clearSelection();
    }

    // Calculate the bounds of the selection rectangle
    let x1 = Math.min(mouse.gameX, mouse.dragX);
    let y1 = Math.min(mouse.gameY, mouse.dragY);
    let x2 = Math.max(mouse.gameX, mouse.dragX);
    let y2 = Math.max(mouse.gameY, mouse.dragY);

    game.items.forEach(function(item) {
      // Unselectable items, dead items, opponent team items and buildings are not drag-selectable
      if (!item.selectable || item.lifeCode === "dead" || item.team != game.userHouse || item.type === "buildings") {
        return;
      }
      let x = item.x * game.gridSize;
      let y = item.y * game.gridSize;
      if (x1 <= x && x2 >= x) {
        if ((item.type === "units" && y1 <= y && y2 >= y)
          // In case of aircraft, adjust for pixelShadowHeight
          ||
          (item.type === "aircraft" && (y1 <= y - item.pixelShadowHeight) && (y2 >= y - item.pixelShadowHeight))) {

          game.selectItem(item, shiftPressed);

        }
      }
    });
    mouse.dragSelect = false;
  },

  buildableColor: "rgba(0,0,255,0.3)",
  unbuildableColor: "rgba(255,0,0,0.3)",
  draw: function() {
    // If the player is dragging and selecting, draw a white box to mark the selection area
    if (this.dragSelect) {
      let x = Math.min(this.gameX, this.dragX);
      let y = Math.min(this.gameY, this.dragY);

      let width = Math.abs(this.gameX - this.dragX);
      let height = Math.abs(this.gameY - this.dragY);

      game.foregroundContext.strokeStyle = "white";
      game.foregroundContext.strokeRect(x - game.offsetX, y - game.offsetY, width, height);
      //console.log(this.dragSelect);
    }
    if (mouse.insideCanvas && resourcebar.deployBuilding && resourcebar.placementGrid) {
      let x = (this.gridX * game.gridSize) - game.offsetX;
      let y = (this.gridY * game.gridSize) - game.offsetY;

      for (let i = resourcebar.placementGrid.length - 1; i >= 0; i--) {
        for (let j = resourcebar.placementGrid[i].length - 1; j >= 0; j--) {
          let tile = resourcebar.placementGrid[i][j];

          if (tile) {
            game.foregroundContext.fillStyle = (tile === 1) ? this.buildableColor : this.unbuildableColor;
            game.foregroundContext.fillRect(x + j * game.gridSize, y + i * game.gridSize, game.gridSize, game.gridSize);
          }
        }
      }
    }
  },
  leftClick: function(shiftPressed) {
    if (resourcebar.deployBuilding) {
      if (resourcebar.canDeployBuilding) {
        resourcebar.finishDeployingBuilding();
      } else {
        console.log("Warning! Cannot deploy building here.");
        // game.showMessage("system", "Warning! Cannot deploy building here.");
      }

      return;
    }

    let clickedItem = mouse.itemUnderMouse();

    if (clickedItem) {
      // Pressing shift adds to existing selection. If shift is not pressed, clear existing selection
      if (!shiftPressed) {
        game.clearSelection();
      }

      game.selectItem(clickedItem, shiftPressed);
    }
  },
  itemUnderMouse: function() {
    for (let i = game.items.length - 1; i >= 0; i--) {
      let item = game.items[i];

      // Dead items will not be detected
      if (item.lifeCode === "dead") {
        continue;
      }

      let x = item.x * game.gridSize;
      let y = item.y * game.gridSize;

      if ((item.team == game.userHouse) && (item.type === "buildings")) {
        // If mouse coordinates are within rectangular area of building or terrain
        if (x <= mouse.gameX && x >= (mouse.gameX - item.baseWidth) && y <= mouse.gameY && y >= (mouse.gameY - item.baseHeight)) {
          return item;
        }
      } else if ((item.team == game.userHouse) && item.type === "units") {

        // If mouse coordinates are within radius of item
        if (Math.pow(x - mouse.gameX, 2) + Math.pow(y - mouse.gameY, 2) < Math.pow(item.radius, 2)) {
          return item;
        }
      }
      // else if (item.type === "terrains"){
      //   if ((Math.floor(mouse.gameX / game.gridSize) == item.x) && (Math.floor(mouse.gameY/ game.gridSize) == item.y))
      //     return item;
      // }
    }
  },

  mouserightclickhandler: function(ev) {
    // console.log("right clicked!");
    mouse.rightClick(ev, true);
    ev.preventDefault(true);
  },

  rightClick: function() {
    let clickedItem = mouse.itemUnderMouse();
    if (clickedItem) {

      // if right-click on an entity
      if (clickedItem.team != game.userHouse) {
        // if right-click on AI's Object
        let uids = [];
        game.selectedItems.forEach(function(item) {
          if (item.team == game.userHouse && item.canAttack && item.canMove) {
            uids.push(item.uid);
          }
        })
        if (uids.length > 0) {
          game.sendCommand(uids, {
            type: "attack",
            toUid: clickedItem.uid
          });
        }
      } else {
        // if right-click on player's own Object
        let uids = [];
        game.selectedItems.forEach(function(item) {
          if (item.team == game.userHouse && item.canAttack && item.canMove) {
            uids.push(item.uid);
          }
        })
        if (uids.length > 0) {
          game.sendCommand(uids, {
            type: "guard",
            toUid: clickedItem.uid
          });
        }
      }
    } else {
      // if right-click is not on an entity
      let uids = [];
      game.selectedItems.forEach(function(item) {
        if (item.team == game.userHouse && item.canMove) {
          uids.push(item.uid);
        }
      })
      if (uids.length > 0) {
        game.sendCommand(uids, {
          type: "move",
          to: {
            x: mouse.gameX / game.gridSize,
            y: mouse.gameY / game.gridSize
          }
        });
        // console.log("move to x: " + mouse.gameX / game.gridSize + "y: "+mouse.gameY / game.gridSize);
      }
    }
  }
}
export {
  mouse
};
