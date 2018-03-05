import {loader} from './common.js';
import {game} from './game.js';
import {initialGameState} from './levels.js';


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

var houses = {
  data: [{
      "name": "Stark",
      "img_url": "./images/icons/stark",
      "description": "The House Stark specialize in xxxx",
    },
    {
      "name": "Lannister",
      "img_url": "./images/icons/lannister",
      "description": "The House Lannister specialize in xxxx",
    },
    {
      "name": "Baratheon",
      "img_url": "./images/icons/baratheon",
      "description": "The House Baratheon specialize in xxxx",
    },
    {
      "name": "Greyjoy",
      "img_url": "./images/icons/greyjoy",
      "description": "The House Greyjoy specialize in xxxx",
    },
    {
      "name": "Targaryen",
      "img_url": "./images/icons/targaryen",
      "description": "The House Targaryen specialize in xxxx",
    }
  ],

  init: function() {
    var selectHouseScreen = document.getElementById("selectHouseScreen");

    // An event handler to call
    var buttonClickHandler = function() {
      //game.userHouse = houses.data[this.value].name;
      game.userHouse = this.name;
      var AIHouse = Math.floor(Math.random() * 5);
      while (AIHouse == this.name){
        AIHouse = Math.floor(Math.random() * 5);
      }

      //game.AIHouse = houses.data[AIHouse].name;
      game.AIHouse = AIHouse;
      houses.populateBothHouseScreen(this.name,AIHouse);
      game.hideScreens();
      game.showScreen("showSelectedHouses");
      game.loadLevelData();
      game.offsetX = initialGameState[game.userHouse][0].x * game.gridSize - game.canvasWidth/2;
      game.offsetY = initialGameState[game.userHouse][0].y * game.gridSize - game.canvasHeight/2;
      game.offsetX = Math.max(0, game.offsetX);
      game.offsetY = Math.max(0, game.offsetY);
      game.offsetX = Math.min(game.currentMap.mapGridWidth * game.gridSize - game.canvasWidth, game.offsetX);
      game.offsetY = Math.min(game.currentMap.mapGridHeight * game.gridSize - game.canvasHeight, game.offsetY);
      // loader.onload = game.play();
      setTimeout(function(){
        game.play();
      }, 1000);

    };
		//setup difficulty buttons
		let difficultyButtonContainer = document.getElementById("difficultyButtonContainer");
		let easyButton = document.createElement("button");
		let easyButtonText = document.createTextNode("Easy");
		easyButton.appendChild(easyButtonText);
		easyButton.className = "difficulty-button";
		easyButton.style.color = 'blue';
		easyButton.addEventListener("click", (e)=>{
			e.preventDefault();
			game.setDifficulty("easy");
		});
		let hardButton = document.createElement("button");
		let hardButtonText = document.createTextNode("Hard");
		hardButton.appendChild(hardButtonText);
		hardButton.className = "difficulty-button";
		hardButton.style.color = 'red';
		hardButton.addEventListener("click", (e)=>{
			e.preventDefault();
			game.setDifficulty("hard");
		});
		difficultyButtonContainer.appendChild(easyButton);
		difficultyButtonContainer.appendChild(hardButton);
    for (let i = 0; i < houses.data.length; i++) {
      var button = document.createElement("input");
      button.type = "button";
      button.name = i;
      var img_url = "url("+houses.data[i].img_url + ".png)";
      button.style.top = "200px";
      button.style.margin = "20px";
      button.style.width="130px";
      button.style.height="130px";
      button.style.backgroundImage = img_url;
			button.style.backgroundPosition = "center";
			button.style.backgroundRepeat = "no-repeat";
			button.style.backgroundSize = "contain";
      // button.style.backgroundImage = "url('./images/icons/targaryen.png')";
      // button.style.backgroundColor = "red";
      button.addEventListener("click", buttonClickHandler);

      selectHouseScreen.appendChild(button);
    }

  },
  populateBothHouseScreen: function(user1, user2)
  {
    //console.log(game.userHouse + " vs. " + game.AIHouse);
    var showSelectedHouses = document.getElementById("showSelectedHouses");
    var button1 = document.getElementById("button1");
    button1.type = "button";
    var img_url = "url("+houses.data[user1].img_url + ".png)";
    button1.style.top = "200px";
    button1.style.margin = "80px";
    button1.style.width="150px";
    button1.style.height="150px";
    button1.style.backgroundImage = img_url;
		button1.style.backgroundPosition = "center";
		button1.style.backgroundRepeat = "no-repeat";
		button1.style.backgroundSize = "contain";
    showSelectedHouses.appendChild(button1);

    var button2 = document.getElementById("button2");
    button2.type = "button";
    var img_url = "url("+houses.data[user2].img_url + ".png)";
    button2.style.top = "200px";
    button2.style.margin = "80px";
    button2.style.width="150px";
    button2.style.height="150px";
    button2.style.backgroundImage = img_url;
		button2.style.backgroundPosition = "center";
		button2.style.backgroundRepeat = "no-repeat";
		button2.style.backgroundSize = "contain";
    showSelectedHouses.appendChild(button2);

  },


  loadImages: function(){
    for (let i = 0; i < houses.data.length; i++) {
      loader.loadImage(houses.data[i].img_url+".png");
      loader.onload = game.showSelectDifficulty();
    }
	}
};

export {houses};
