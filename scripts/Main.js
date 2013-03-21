require.config({
	paths: {
		"backbone": "/node_modules/backbone/backbone",
		"underscore": "/node_modules/underscore/underscore"
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "backbone"
		}
	}
});

requirejs(["backbone", "/scripts/BoardModel.js"],

function(Backbone, Board) {
	var b = new Board({
		name: "Portal"
	});

	var elements = [$("#b1"), $("#b2")];
	var socket = io.connect('http://localhost:8080');

	var localState;
	socket.on('state', function(state) {
		localState = state;
		$(state).each(function(index) {
			var ele = $(".block")[index];

			console.log(ele);
			console.log(state[index]);
			if (state[index]) {
				$(ele).css("background-color", "green");
			} else {
				$(ele).css("background-color", "red");
			}
		});
	});

	$(function() {
		$(".block").click(function() {
			console.log(this);
			localState[this.id] = !localState[this.id];
			socket.emit("updateState", localState);

		});
	});
});