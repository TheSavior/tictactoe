function Board() {
	var socket;
	var localState;

	var playerNum;

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
			console.log("Player: "+number);
			playerNum = number;
		});
	};

	// called when a piece is clicked on
	this.clickPiece = function(index) {
		set(index, playerNum);
		savePiece(index, playerNum);
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