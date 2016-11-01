// Node JavaScript Server
// 

const MAX_CLIENT_CONNECTIONS = 100;

// NETWORK PROC EVENTS
const NEW_CONNECTION = 1;
const LOST_CONNECTION = 2;
const DROP_CONNECTION = 3;
const CLIENT_EVENT = 4;

// GAME FREQUENCY
const TICK_FREQ = 60;
const TICK_DT = 0.016667;
const TICK_DT_MILLI = 16.667;

// FREQUENCY DIVISORS
const SLOWEST = 6;
const SLOWER = 10;
const SLOW = 12;
const NORMAL = 15;
const FAST = 20;
const FASTEST = 30;

//
function milli() {
	var hrTime = process.hrtime();
	var millis = Math.floor(1000.0 * hrTime[0] + hrTime[1] / 1000000.0);
	return millis;
}

// Breaking the JavaScript speed limit.
function NULL_EVENT() 
{
	return  {
				event: 0,
				data: null
			};
}
//
function NULL_CLIENT() 
{
	return  {
				guid: 111,
				uid: 11,
				alive: false,
				connectTime: 0,
				lastTime: 0,
				frequency: SLOWEST,
				forgiveness: 2*SLOWEST,
				lastFrame: 0
			};
}
//
function NULL_CONNECT() 
{ 
	return  {
				guid: "abcd",
				uid: "abc"
			}; 
}
//
function NULL_DISCONNECT() 
{ 
	return  {
				guid: "abcd",
				uid: "abc"
			}; 
}
//
function NULL_CLIENT_EVENT() 
{ 
	return  {
				event: 0,
				guid: "abcd",
				uid: "abc"
			}; 
}

////
class TedgeGameServer() 
{
	//
	constructor() 
	{ 
		// create all the data structures

		//
		this.gameState = null;

		//
		this.timerID = -1;
		this.currentMilli = 0;
		this.currentFrame = 0;		
		this.currentTick = 0;

		this.frameEvents = [];
		for (var i = 0; i < TICK_FREQ; i++) {
			var eventWindow = [];
			eventWindow.push(NULL_EVENT());
			this.frameEvents.push(eventWindow);
		}

		//
		this.clientConnections = [];
		for (var i = 0; i < MAX_CLIENT_CONNECTIONS; i++) {
			this.clientConnections.push(NULL_CLIENT());
		}

		//
		this.connectEvents = [];
		this.connectEvents.push(NULL_CONNECT());

		//
		this.disconnectEvents = [];
		this.disconnectEvents.push(NULL_DISCONNECT());

		//
		this.clientEvents = [];
		this.clientEvents.push(NULL_CLIENT_EVENT());
	}

	//
	shutdown() 
	{
		//
		if (this.timerID !== -1) {
			clearInterval(this.timerID);
			this.timerID = -1;
		}
		//
		if (this.gameState && this.gameState.shutdown) 
		{
			this.gameState.shutdown();
		}
		//
	}

	//
	initialize(gameInstance) 
	{ 
		this.gameState = gameInstance; 
	}

	// @60 fps
	tick() 
	{
		// handle disconnects
		this.handleDisconnects();
		
		// handle client requests
		this.handleClientEvents();

		// game logic
		this.currentMilli = milli();
		this.currentTick = (++this.currentFrame % TICK_FREQ);
		this.frameEvents[this.currentTick] = this.gameState.serverUpdate(TICK_DT);

		// handle client updates
		this.handleHeartbeat();

		// handle new connections
		this.handleNewConnections();
	}

	//
	handleHeartbeat() 
	{
		var netState = this.gameState.getPartialState();

		// each client that has an update this frame
		for (var i = 0; i < this.clientConnections.length; i++) {
			var client = this.clientConnections[i];
			// find alive clients
			if (client.alive) {
				var delta = (this.currentFrame - client.lastFrame);
				if (delta === client.frequency) {
					var update = {
						uid: client.uid, 
						guid: client.guid,
						time: this.currentMilli,
						frame: this.currentFrame
					};

					// send client events from last X frames
					update.events = [];
					for (var i = clientFrequency-1; i >= 0; i--) {
						var frame = (this.currentFrame + TICK_FREQ - i) % TICK_FREQ;
						update.events = update.events.concat(this.frameEvents[frame]);
					}

					// send client object state
					update.state = netState;

					//
					/* client.send(update); */
					process.send({
						type: CLIENT_EVENT,
						data: update
					});

					client.lastFrame = this.currentFrame;
				}
			}
		}
	}

	//
	handleClientEvents()
	{
		for (var i = 0; i < this.clientEvents.length; i++) {
			var event = this.clientEvents[i];
			var client = ;
			this.gameState.clientEvent(client, event);
		}

		this.clientEvents = [];
	}

	//
	handleDisconnects() 
	{
		for (var i = 0; i < this.disconnectEvents.length; i++) {
			var disconnect = this.disconnectEvents[i];

			delete y;
		}

		this.disconnectEvents = [];
	}

	//
	handleNewConnections() 
	{
		var completeState = this.gameState.getCompleteState();
		for (var i = 0; i < this.disconnectEvents.length; i++) {
			var connect = this.connectEvents[i];

			var x;
		}

		this.connectEvents = [];
	}

	//
	listen() 
	{
		var _this = this;
		process.send('begin');
		process.on('message', function (message) {
			var type = message.type;
			if (type === CLIENT_EVENT) {
				_this.procClientEvent(message.data);
			} else {
				_this.procEvent(message.type, message.data);
			}
		});
	}

	//
	procClientEvent(data) 
	{
		this.clientEvents.push(data);
	}

	//
	procEvent(type, data) 
	{
		if (TYPE === NEW_CONNECTION) {
			this.connectEvents.push(data);
		} 
		else if (TYPE === LOST_CONNECTION) {
			this.disconnectEvents.push(data);
		} 
	}

	//
	startWhenReady() 
	{
		var _this = this;
		if (this.timerID !== -1) {
			clearInterval(this.timerID);
			this.timerID = -1;
		}
		this.timerID = setInterval(function () { _this.tick(); }, TICK_DT_MILLI);
	}
}

//
var tedge = {};
tedge.GameServer = TedgeGameServer;

