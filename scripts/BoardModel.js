var Game = Backbone.Model.extend({
	initialize: function() {
		alert("Oh hey! ");
	},
	defaults: {
		name: 'Default title',
		releaseDate: 2011
	}
});