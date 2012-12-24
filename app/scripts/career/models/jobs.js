define(['backbone', 'career/models/job'], function(Backbone, Job){
  'use strict';

  var Jobs = Backbone.Model.extend({
    name: '',
    slug: '',
    image: '',
    model: Job,
    idAttribute: 'id'
  });

  return Jobs;
});