var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

 io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

server.listen(8080, process.env.IP);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var state = [true, false];

io.sockets.on('connection', function (socket) {
    socket.emit('state', state);

    socket.on('updateState', function (localState) {
        state = localState;
        io.sockets.emit('state', state);
    });

});