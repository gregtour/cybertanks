/* */

// libraries and utilities needed to create a game simulation

class TedgeGame() {
	constructor (isHost) {
		this.isHost = !!isHost;
	}

	update () {
		// update game logic
		// game significant state changes should launch an event, which is queued.
		// for example, changes in input would launch an event
		// also, game events like item collision, bullet collision, et cetera.
	}

	host () {
		// host network event
	}

	client () {
		// client network event
	}

	queue() {
		// queue game message
	}
};
