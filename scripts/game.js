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
				console.log("Updating r:" + row + ", col:" + col);
				// If that spot hasn't been claimed, and it's the given players turn
				if (state[row][col] === 0 && playersTurn == playerNum) {
					state[row][col] = playerNum;
					socket.broadcast.emit('stateChange', row, col, playerNum);

					if (playersTurn == 1) playersTurn = 2;
					else playersTurn = 1;

					if (parent.isGameOver(row, col, playerNum)) {
						console.log("------------------------------");
						console.log("GAME IS OVER!!!");
						console.log("------------------------------");
						io.sockets.emit("gameOver", playerNum);
					} else {
						io.sockets.emit('playersTurn', playersTurn);
					}
				}
			});

			socket.on('disconnect', function() {
				parent.removePlayer(socket);
				console.log("===========================Player Removed");
			});

		});
	};

	// Given that playerNum just went at row/col, did it end the game?
	this.isGameOver = function(row, col, playerNum) {
		console.log("------------------------------");
		console.log("checking if game is over");
		console.log("------------------------------");


		// Algorithm taken from http://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over-java
		var n = state.length;
		// check row
		for (var i = 0; i < n; i++) {
			if (state[row][i] != playerNum) {
				break;
			}

			if (i == n - 1) {
				return true;
			}
		}

		// check col
		for (i = 0; i < n; i++) {
			if (state[i][col] != playerNum) {
				break;
			}

			if (i == n - 1) {
				return true;
			}
		}

		if (row == col) {
			//we're on a diagonal
			for (i = 0; i < n; i++) {
				if (state[i][i] != playerNum) {
					break;
				}

				if (i == n - 1) {
					return true;
				}
			}
		}

		//check anti diag (thanks rampion)
		for (i = 0; i < n; i++) {
			if (state[i][(n - 1) - i] != playerNum) {
				break;
			}

			if (i == n - 1) {
				return true;
			}
		}

		// Is every spot taken?
		for (i = 0; i < n; i++) {
			for (var j = 0; j < n; j++) {
				if (state[i][j] === 0) {
					return false;
				}
			}
		}

		// Every piece is taken.
		return true;
	};

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