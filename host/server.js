/* */

var TedgeServer = require('../tedge/tedge-server.js');
var game = require('../game/main.js');
const clientconfig = require('../client/config.js');
//const;

/* server specific logic */
class TankServer extends TedgeServer {
	constructor() {
		super();
		this.game = new game();
	}

	xy() {

	}
}

/*
 tedge handles a client page
 tedge handles socket.io
 set up simple sim
*/
//tedge.start(TanksServer, game, client);

TedgeServer.instance = new TankServer();
TedgeServer.instance.start();
