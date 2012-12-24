define(['backbone'], function(Backbone){
  'use strict';

  var SlideImage = Backbone.Model.extend({
    name: '',
    image: '',
    thumb: ''
  });

  return SlideImage;
});