define(['backbone'], function(Backbone){
  'use strict';

  var Job = Backbone.Model.extend({
    name: '',
    city: '',
    top_content: '',
    skills: '',
    desired_skills: '',
    bottom_content: '',
    category: '',
    idAttribute: 'id'
  });

  return Job;
});