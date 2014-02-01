define(['backbone'], function(Backbone){
  'use strict';

  var Page = Backbone.Model.extend({
    idAttribute: 'id',
    caption: '',
    content: '',
    thumb: '',
    image: '',
    type: '',
    no_job_text: ''
  });

  return Page;
});
