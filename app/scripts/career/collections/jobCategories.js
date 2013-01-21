define(['backbone', 'career/models/jobCategory'], function(Backbone, JobCategory){
  'use strict';

  var JobCategories = Backbone.Collection.extend({
    model: JobCategory
  });

  return JobCategories;
});