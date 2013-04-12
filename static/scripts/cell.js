define(['knockout'], function(ko) {
    return function cell(row, col) {
        var self = this;

        // This will be empty if it hasn't been claimed
        // X, or O if it has
        self.type = ko.observable(0);

        self.set = function(player) {
            if (player == 1) {
                self.type("X");
            } else if (player == 2) {
                self.type("O");
            } else {
                self.type(0);
            }
        };

        self.getRow = function() {
            return row;
        };

        self.getCol = function() {
            return col;
        };
    };
});