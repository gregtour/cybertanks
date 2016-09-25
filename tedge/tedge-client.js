/* */

// libraries needed to make an HTML5 game with WebGL

class TedgeClient {
	constructor (target) {
		if (target) {
			// make socket.io connection
		}
	}

	connect () {

	}

	render () {

	}

	load () {

	}
};

TedgeClient.startupClass = null;

module.exports = TedgeClient;

window.onload = function () {
	if (TedgeClient.startupClass) {
		TedgeClient.instance = new (TedgeClient.startupClass)();
	}
}

