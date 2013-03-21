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
			this.toggle(index, state);
		});
	};

	this.toggle = function(index, state) {
		if (!state) state = flip(localState[index]);

		localState[index] = state;
		render();
		this.save();
	};

	this.getState = function() {
		return localState;
	};

	this.save = function() {
		socket.emit("updateState", localState);
	};

	function render() {
		$(localState).each(function(index) {
			var ele = $(".board td")[index];

			var text = localState[index];
			if (text == "x") {
				$(ele).css("background-color", "green");
			} else if (text == "o") {
				$(ele).css("background-color", "red");
			}
			console.log(ele);
		});
	}

	// Returns the opposite state given

	function flip(state) {
		if (state == "x") return "o";
		else return "x";
	}
}