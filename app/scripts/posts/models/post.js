define(['backbone'], function(Backbone){
	'use strict';

	var Post = Backbone.Model.extend({
    title: '', 
    author: '', 
    link: '', 
    pub_date: '', 
    post_type: '', 
    pub_place: '',
    idAttribute: 'id'
	})

	return Post;
});