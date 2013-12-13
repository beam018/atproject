define(['backbone'], function(Backbone){
  'use strict';

  var Page = Backbone.Model.extend({
  	idAttribute: 'id',
    caption: '',
    content: '',
    thumb: '',
    image: '',
    type: ''
  });

  return Page;
});