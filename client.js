// Browser Client
// Client

class TankGameClient extends TankGame 
{
	constructor() 
	{
		super();
	}

	startup() 
	{
		super();
		this.player = new Player();
	}

	clientUpdate(dt) 
	{
	}

	acceptCompleteState(state) 
	{ 
	}
	
	acceptPartialState(state) 
	{ 
	}

	serverEvent(e) 
	{ 
	}
}

var client = new TankGameClient();

client.prototype.render = function () 
{


};

client.startup();


function callback(state) {
	client.acceptCompleteState(state);
}

