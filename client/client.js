/* client specific code */
/* display, input, sound, etc */

// we are using common.js
var TedgeClient = require('../tedge/tedge-client.js'); 
var game = require('../game/main.js');

// now we have everything we need
class TankGame extends TedgeClient {
	constructor() {
		super();
		this.game = /*new game();*/ null;
	}

	connect () {
		super();
	}

	render () {
		super();
	}

	load () {
		super();
	}
}

TedgeClient.startupClass = TankGame;

