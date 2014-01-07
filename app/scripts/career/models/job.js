define(['backbone'], function(Backbone){
  'use strict';

  var Job = Backbone.Model.extend({
    name: '',
    city: '',
    top_content: '',
    requirements: '',
    skills: '',
    desired_skills: '',
    bottom_content: '',
    category: '',
    project: '',
    test_task: '',
    idAttribute: 'id'
  });

  return Job;
});