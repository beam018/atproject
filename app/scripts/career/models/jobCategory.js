define(['backbone'], function(Backbone){
  'use strict';

  var JobCategory = Backbone.Model.extend({
    name: '',
    thumb: '',
    background: '',
    content: '',
    no_jobs_text: '',
    count: 0,
    idAttribute: 'id'
  });

  return JobCategory;
});
