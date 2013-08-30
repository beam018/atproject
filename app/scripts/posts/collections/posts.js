define(['backbone', 'posts/models/post'], function(Backbone, Post){
	'use strict';

	var Posts = Backbone.Collection.extend({
		model: Post
	})

	return Posts;
});