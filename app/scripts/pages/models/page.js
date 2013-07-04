define(['backbone'], function(Backbone){
	'use strict';

	var Page = Backbone.Model.extend({
		title: '',
		type: '',
		content: '',
		thumb: '',
		idAttribute: 'id'
	})

	return Page;
});