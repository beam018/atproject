define(['backbone', 'career/models/jobs'], function(Backbone, Jobs){
  'use strict';

  var JobsList = Backbone.Collection.extend({
    model: Jobs
  });

  return JobsList;
});