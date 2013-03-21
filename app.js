var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var requirejs = require('requirejs');

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

server.listen(8080, process.env.IP);

requirejs.config({
  //Pass the top-level main.js/index.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});



requirejs([__dirname + '/scripts/board.js', 'backbone'],

function(Person, sio) {
  var person1 = new Person("Seb");
  console.log(person1.getFirstName());
});



// routing
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));
// serve require.js from node_modules
app.get('/scripts/require.js', function(req, res) {
  res.sendfile(__dirname + '/node_modules/requirejs/require.js');
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

var state = [true, false];

io.sockets.on('connection', function(socket) {
  socket.emit('state', state);

  socket.on('updateState', function(localState) {
    state = localState;
    io.sockets.emit('state', state);
  });
});