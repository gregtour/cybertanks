/* */

const tedge = require('../tedge/tedge-server.js');
const game = require('../game/main.js');
const client = require('../client/config.js');
//const;

/* server specific logic */
var TanksServer = function() {

};

TanksServer.prototype = {

};

/*
 tedge handles a client page
 tedge handles socket.io
 set up simple sim
*/
tedge.start(TanksServer, game, client);


