define(['backbone', 'career/models/job'], function(Backbone, Job){
  'use strict';

  var JobsList = Backbone.Collection.extend({
    model: Job
  });

  return JobsList;
});