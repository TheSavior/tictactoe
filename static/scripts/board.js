define(['knockout', 'cell'], function(ko, Cell) {
	return function viewModel() {
		"use strict";
		var self = this;

		self.board = ko.observableArray();

		self.initialize = function() {
			var rows = 3;
			var cols = 3;
			for (var i = 0; i < rows; i++) {
				var inner = ko.observableArray();
				for (var j = 0; j < cols; j++) {
					inner.push(new Cell(i, j));
				}

				self.board.push(inner);
			}
		};

		self.setPiece = function(piece, player) {
			piece.set(player);
		};

		self.getPiece = function(row, col) {
			return self.board()[row]()[col];
		};
	};
});