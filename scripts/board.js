function Board() {
	"use strict";

	var socket;
	var localState;

	var playerNum;

	var playersTurn = 1;

	this.initialize = function() {
		var turnEle = $("#whoseTurn")[0];

		socket = io.connect('/');

		socket.on('state', function(state) {
			localState = state;
			render();
		});

		socket.on('stateChange', function(row, col, state) {
			set(row, col, state);
		});

		socket.on('player', function(number) {
			console.log("Player: " + number);
			playerNum = number;
		});

		socket.on('playersTurn', function(psTurn) {
			playersTurn = psTurn;

			var turnEle = $("#whoseTurn")[0];
			var text = "";
			if (playersTurn == playerNum) {
				text = "It's your turn!";
			} else {
				text = "It's player " + playersTurn + "'s turn!";
			}

			$(turnEle).text(text);
			console.log(text);
		});

		socket.on('gameOver', function(winnerNum) {
			var turnEle = $("#whoseTurn")[0];
			var text;
			if (winnerNum == playerNum) {
				text = "You Win!";
			} else {
				text = "You lose!";
			}

			$(turnEle).text(text);
			console.log(text);
		});
	};

	// called when a piece is clicked on
	this.clickPiece = function(ele) {
		var row = $(ele).data("row");
		var col = $(ele).data("col");

		// If that spot hasn't been claimed
		if (localState[row][col] === 0 && playersTurn == playerNum) {
			set(row, col, playerNum);
			savePiece(row, col, playerNum);
		}
	};

	function savePiece(row, col, playerNum) {
		socket.emit("updatePiece", row, col, playerNum);
	}

	function set(row, col, playerNum) {
		localState[row][col] = playerNum;
		render();
	}

	function render() {
		$(localState).each(function(row) {
			$(localState[row]).each(function(col) {
				var ele = $("*[data-row=" + row + "][data-col=" + col + "]").first();

				var text = localState[row][col];
				if (text == 1) {
					$(ele).css("background-color", "green");
				} else if (text == 2) {
					$(ele).css("background-color", "red");
				}

			});
		});
	}
}