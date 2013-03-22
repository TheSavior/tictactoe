function Game() {
	var player1;
	var player2;

	// Initialize our board of 9 spots
	var state = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
				];

	var playersTurn = 1;

	this.initialize = function(io) {
		var parent = this;

		io.sockets.on('connection', function(socket) {
			console.log("==============================Player connected");
			parent.setPlayer(socket);

			socket.emit('playersTurn', playersTurn);

			socket.emit('state', state);

			socket.on('updatePiece', function(row, col, playerNum) {
				console.log("::::::::::::::::::::::::::::");
				console.log("Updating r:"+row+", col:"+col);
				// If that spot hasn't been claimed, and it's the given players turn
				if (state[row][col] === 0 && playersTurn == playerNum) {
					state[row][col] = playerNum;
					socket.broadcast.emit('stateChange', row, col, playerNum);

					if (playersTurn == 1) playersTurn = 2;
					else playersTurn = 1;

					parent.isGameOver();
					io.sockets.emit('playersTurn', playersTurn);
				}
			});

			socket.on('disconnect', function() {
				parent.removePlayer(socket);
				console.log("===========================Player Removed");
			});

		});
	};

	this.isGameOver = function() {
		console.log("------------------------------");
		console.log("checking if game is over");
		console.log("------------------------------");

	}

	var lastPlayer = 2;
	// Take a socket and set that to be one of the players
	this.setPlayer = function(socket) {
		if (lastPlayer == 2) {
			player1 = socket;
			socket.emit("player", 1);
		} else {
			player2 = socket;
			socket.emit("player", 2);
		}

		if (lastPlayer == 1) lastPlayer = 2;
		else lastPlayer = 1;

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