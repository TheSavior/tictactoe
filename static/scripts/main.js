require.config({
    paths: {
        'knockout': 'knockout-2.2.1'
    }
});

require(["jquery", "knockout", "game"], function($, ko, Game) {
    $(function() {
        var game = new Game();
        game.initialize();

        ko.applyBindings(game);
    });
});