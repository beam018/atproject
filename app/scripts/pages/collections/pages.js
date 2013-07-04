define(['backbone', 'pages/models/page'], function(Backbone, Page){
	'use strict';

	var Pages = Backbone.Collection.extend({
		model: Page,

		getElement: function() {
      return this.currentElement;
    },

    setElement: function(model) {
      this.currentElement = model;
    },
	})

	return Pages;
})