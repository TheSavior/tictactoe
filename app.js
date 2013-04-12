var requirejs = require('requirejs');

requirejs.config({
	baseUrl: "./scripts",
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	nodeRequire: require
});

requirejs(['express', 'http', 'socket.io', 'game'], function(express, http, socket, Game) {
	var app = express();
	var server = http.createServer(app);
	var io = socket.listen(server);

	server.listen(process.env.PORT || 8081, process.env.IP);

	app.use(express.static(__dirname + '/static'));
	app.use(express.logger());

	console.log('Server running');

	var game = new Game();
	game.initialize(io);
});