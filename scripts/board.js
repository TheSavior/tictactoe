function Board() {
	var socket;
	var localState;

	var playerNum;

	var playersTurn = 1;

	this.initialize = function() {
		socket = io.connect('http://localhost:8080');

		socket.on('state', function(state) {
			localState = state;
			render();
		});

		socket.on('stateChange', function(index, state) {
			set(index, state);
		});

		socket.on('player', function(number) {
			console.log("Player: " + number);
			playerNum = number;
		});

		socket.on('playersTurn', function(psTurn) {
			playersTurn = psTurn;
			if (playersTurn == playerNum) {
				console.log("It's your turn!");
			} else {
				console.log("It's player " + playersTurn + "'s turn!");
			}
		});
	};

	// called when a piece is clicked on
	this.clickPiece = function(index) {
		// If that spot hasn't been claimed
		if (localState[index] === 0 && playersTurn == playerNum) {
			set(index, playerNum);
			savePiece(index, playerNum);
		}
	};

	function savePiece(index, playerNum) {
		socket.emit("updatePiece", index, playerNum);
	}

	function set(index, playerNum) {
		localState[index] = playerNum;
		render();
	}

	function render() {
		$(localState).each(function(index) {
			var ele = $(".board td")[index];

			var text = localState[index];
			if (text == 1) {
				$(ele).css("background-color", "green");
			} else if (text == 2) {
				$(ele).css("background-color", "red");
			}
		});
	}
}