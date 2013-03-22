function Game() {
	var player1;
	var player2;

	var board;

	// Initialize our board of 9 spots
	var state = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	this.initialize = function(io) {
		var parent = this;

		io.sockets.on('connection', function(socket) {
			console.log("==============================Player connected");
			parent.setPlayer(socket);

			socket.emit('state', state);

			socket.on('updatePiece', function(index, playerNum) {
				// If that spot hasn't been claimed
				if (state[index] === 0) {
					state[index] = playerNum;
					socket.broadcast.emit('stateChange', index, playerNum);
				}
			});

			socket.on('disconnect', function() {
				parent.removePlayer(socket);
				console.log("===========================Player Removed");
			});

		});
	};

	var lastPlayer = 0;
	// Take a socket and set that to be one of the players
	this.setPlayer = function(socket) {
		if (lastPlayer === 0 || lastPlayer == 2) {
			player1 = socket;
			socket.emit("player", 1);
		} else {
			player2 = socket;
			socket.emit("player", 2);
		}

		lastPlayer = (lastPlayer + 1 % 2);
		/*
		// This works if disconnect works
		if (!player1) {
			player1 = socket;
			socket.emit("player", 1);
		} else {
			player2 = socket;
			socket.emit("player", 2);
		}
		*/
	};

	// Remove the socket from the game
	this.removePlayer = function(socket) {
		if (player1 == socket) {
			player1 = null;
		} else if (player2 == socket) {
			player2 = null;
		}
	};
}

module.exports = Game;