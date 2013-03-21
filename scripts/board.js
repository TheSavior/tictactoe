function Board() {
	var socket;
	var localState;

	this.initialize = function() {
		socket = io.connect('http://localhost:8080');

		socket.on('state', function(state) {
			localState = state;
			render();
		});

		socket.on('stateChange', function(index, state) {
			set(index, state);
		});
	};

	// called when a piece is clicked on
	this.toggle = function(index, state) {
		if (!state) state = flip(localState[index]);
		set(index, state);
		savePiece(index, state);
	};

	function savePiece(index, state) {
		socket.emit("updatePiece", index, state);
	}

	function set(index, state) {
		localState[index] = state;
		render();	
	}

	function render() {
		$(localState).each(function(index) {
			var ele = $(".board td")[index];

			var text = localState[index];
			if (text == "x") {
				$(ele).css("background-color", "green");
			} else if (text == "o") {
				$(ele).css("background-color", "red");
			}
		});
	}

	// Helper to get the opposite state of what's given

	function flip(state) {
		if (state == "x") return "o";
		else return "x";
	}
}