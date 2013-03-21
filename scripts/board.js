function Board() {
	var socket;
	var localState;

	this.initialize = function() {
		socket = io.connect('http://localhost:8080');

		socket.on('state', function(state) {
			localState = state;
			render();
		});
	};

	this.toggle = function(index) {
		localState[index] = !localState[index];
		render();
		this.save();	
	};

	this.getState = function() {
		return localState;
	};

	this.save = function() {
		socket.emit("updateState", localState);	
	}

	function render() {
		$(localState).each(function(index) {
			var ele = $(".block")[index];

			if (localState[index]) {
				$(ele).css("background-color", "green");
			} else {
				$(ele).css("background-color", "red");
			}
			console.log(ele);
		});
	}
}