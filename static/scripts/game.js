define(['knockout', 'knockout.mapping-latest',
    'board'], function(ko, komapping, Board) {
    return function viewModel() {
        "use strict";
        var self = this;

        var socket;
        var playerNum;
        var playersTurn = 1;

        self.board = null;

        self.state = ko.observable();

        self.initialize = function() {
            self.board = new Board();
            self.board.initialize();

            socket = io.connect('/');

            socket.on('state', function(state) {
                // parse local state
                //localState = state;
                //self.board = ko.mapping.fromJs(state);
                for (var i = 0; i < state.length; i++) {
                    for (var j = 0; j < state[0].length; j++) {
                        self.board.board()[i]()[j].set(state[i][j].data);
                    }
                }
                /*
                var mapping = {
                    update: function(options) {
                        console.log("update: " + options);
                        return options.data
                    }
                };
                var foo = komapping.fromJS(state, mapping);
                console.log("foo:" + foo());
                */
            });

            socket.on('stateChange', function(row, col, playerNum) {
                // Set a specific element
                var piece = self.board.getPiece(row, col);
                self.board.setPiece(piece, playerNum);
            });

            socket.on('player', function(number) {
                // What player are we?
                console.log("Player: " + number);
                playerNum = number;
            });

            socket.on('playersTurn', function(psTurn) {
                // Set whose turn it is
                playersTurn = psTurn;

                var text = "";
                if (playersTurn == playerNum) {
                    text = "It's your turn!";
                } else {
                    text = "It's player " + playersTurn + "'s turn!";
                }

                self.state(text);
                console.log(text);
            });

            socket.on('gameOver', function(winnerNum) {
                // Game is over
                var text;
                if (winnerNum == playerNum) {
                    text = "You Win!";
                } else {
                    text = "You lose!";
                }

                self.state(text);
            });
        };

        self.clickPiece = function(piece) {
            if (playersTurn == playerNum) {
                self.board.setPiece(piece, playerNum);
                socket.emit("updatePiece", piece.getRow(), piece.getCol(), playerNum);
            }
        };

        self.newGame = function() {
            socket.emit('newGame');
        };
    };
});