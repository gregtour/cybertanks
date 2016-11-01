// Team Duck
//

var Tanks = null;
var GameServer = null;

process.on('SIGTERM', function () {
	if (GameServer) {
		GameServer.shutdown();
	}
	process.exit(0);
});

//
Tanks = new TankGameHost();
Tanks.startupHost();

//
GameServer = new tedge.GameServer();
GameServer.initialize(Tanks);
GameServer.listen();
GameServer.startWhenReady();
