// Team Duck
// Game Server
// Tanks for your support.
// 2011-2016.

var child_process 
			= require('child_process');
//var admin   = require('./admin.js');
var http	= require('http');
var fs 		= require('fs');
var url 	= require('url');
var socketio= require('socket.io'); // 1.5.1
var port	= process.env.PORT || 8000;
var guid    = 140000;
var LOG 	= "stats.json";
var LOGIC_SERVER_BIN 
			= "process.js";

//
// NETWORK PROC EVENTS
const NEW_CONNECTION = 1;
const LOST_CONNECTION = 2;
const DROP_CONNECTION = 3;
const CLIENT_EVENT = 4;
//
const MAX_CLIENT_CONNECTIONS = 100;
//


// Boot up the game logic process.

var game_proc = child_process.spawn('node', [LOGIC_SERVER_BIN], {
	stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});

// Logic for terminating the server.

process.on('SIGTERM', function () {
	game_proc.kill();
	process.exit(0);
});

// Set up an HTTP file host for the game.

var root = staticFileHandler("client/index.html");
var handler = {};
function listFile(file) { handler[file] = staticFileHandler("client/" + file); }
// list of files on the server
handler["index.html"] 	= root;
handler["socket.io.js"] = staticFileHandler("node_modules/socket.io-client/socket.io.js");
// handler["admin"] = admin(stats, statlog);
listFile("favicon.ico");
listFile("server.js");
listFile("game.js");
listFile("tedge.js");
listFile("meshes.js");
listFile("glMatrix-0.9.5.min.js");
listFile("thick.png");
listFile("thin.png");


//
var server = http.createServer(
	function(request, response) { 
		var uri = url.parse(request.url).pathname;
		var filename = uri.substring(1);

		//
		if (filename)
		{
			//
			if (handler[filename])
			{
				handler[filename](request, response);
			}
			else
			{		
				response.writeHead(404, {"Content-Type": "text/plain"});  
				response.write("Error 404: file not found");  
				response.end();
				console.log("requested invalid file: '" + filename + "'");			
			}
		}
		else
		{
			//
			root(request, response);
		}
});

server.listen(port);

//
var CLIENT_TABLE = [];

// Set up a Socket.IO server for the game.

var io = socketio(server); 
io.on('connection', 
	function(client) {
		var IP = request.headers['x-forwarded-for'] || 
				 request.connection.remoteAddress || 
				 request.socket.remoteAddress ||
				 request.connection.socket.remoteAddress || "None";

		var UID;
		var GUID = (guid++);
		//
		for (var i = 0; i < MAX_CLIENT_CONNECTIONS; i++) {
			if (CLIENT_TABLE[i] === undefined) {
				UID = i; break;
			}
		}

		//
		if (UID) {
			var ClientEntry = {
				alive: true,
				uid: UID,
				guid: GUID,
				socket: client,
				data: null;
			};

			CLIENT_TABLE[UID] = ClientEntry;

			// forward client message to game
			client.on('message', function (data) {
				game_proc.send({
					type: CLIENT_EVENT,
					data: data
				});
			});

			// alert game of client disconnect
			client.on('disconnect', function () {
				ClientEntry.alive = false;
				game_proc.send({
					type: LOST_CONNECTION,
					data: {
						uid: UID,
						guid: GUID
					}
				})
			});

			// alert game of new client
			game_proc.send({
				type: NEW_CONNECTION,
				data: {
					uid: UID,
					guid: GUID
				}
			});
		}
});

// Game logic message

game_proc.on('message', 
	function (message) {
		var data = message.data;

		//
		if (message.type === CLIENT_EVENT) 
		{
			var target = data.guid;
			var target_u = data.uid;

			// direct to the corresponding client
			if (CLIENT_TABLE[target_u] && CLIENT_TABLE[target_u].guid === target) 
			{
				var client = CLIENT_TABLE[target_u];
				if (client.alive) {
					client.socket.emit(data);
				}
			}
		} 
		else if (message.type === DROP_CONNECTION) 
		{

		}
});

// HTTP File Server Handler.

var mime_types = 
{
	html:"text/html",
	htm:"text/html",
	css:"text/css",
	js:"text/javascript",
	png:"image/png",
	jpg:"image/jpeg",
	ico:"image/x-icon",
	txt:"text/plain"
};

function staticFileHandler(filename)
{
	// cache the data ahead of time
	var file = fs.readFileSync(filename, "binary");
	var stats = fs.statSync(filename);
	var etag = '"' + stats.ino + '-' + stats.size + '-' + Date.parse(stats.mtime) + '"';
	
	var i = filename.lastIndexOf(".");
	var content_type = "text/plain";
	if (i != -1) 
	{
		var extension = filename.substring(i+1);
		if (extension != "" && mime_types[extension] != undefined)
			content_type = mime_types[extension];
	}	
	
	var header = {
		"Server": 			"tank-game",
		"ETag": 			etag,
		"Content-Type": 	content_type,
		"Content-Length": 	file.length
	}
	
	return function(request, response)
	{
		if (request.headers['if-none-match'] != undefined && 
			request.headers['if-none-match'].indexOf(etag) != -1)
		{
			response.writeHead(304);
			response.end();
			return;
		}

		response.writeHead(200, header);  
		response.write(file, "binary");  
		response.end();
	};
}


