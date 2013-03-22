var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Game = require(__dirname +'/scripts/game.js');
/*
io.configure(function() {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});
*/

server.listen(8080, process.env.IP);




// routing
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
app.use("/scripts", express.static(__dirname + '/scripts'));

var game = new Game();
game.initialize(io);