/* tank game logic goes here */
/* this gets built into the client and the server */

// using commonjs and ES6
var TedgeGame = require('../tedge/tedge-game.js');

class TankGame extends TedgeGame {
	constructor {
		super();
	}

	update () {

		//
		super();
	}

	host (networkEvent) {
		// host has received a network event
		// game.message
		// tedgegame.message
	}

	client (networkEvent) {
		// client has received a network event
		// game.message
		// tedgegame.message
	}

};

module.exports = TankGame;

