var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(process.env.PORT, process.env.IP);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var state = [1, 0];

io.sockets.on('connection', function (socket) {
    io.sockets.emit('state', state);
   
});