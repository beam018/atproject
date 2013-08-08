define(['backbone'], function(Backbone){
  'use strict';

  var JobCategory = Backbone.Model.extend({
    name: '',
    thumb: '',
    background: '',
    content: '',
    no_jobs_text: '',
    idAttribute: 'id'
  });

  return JobCategory;
});