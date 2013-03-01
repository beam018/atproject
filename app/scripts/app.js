define([
  'resources',
  'backbone',
  'career/careerView',
  'projects/projectsView'
], function(resources, Backbone, CareerView, ProjectsView){
  'use strict';

  $(document).ready(function(){

    var dropdown = $('#dropdown');

    var tmpl = _.template($('#dropdown-item-template').html());
    var jobs = _.groupBy(resources.jobs, 'category');

    _.each(resources.jobCategories, function(item, index){
      var count = jobs[item.id] ? jobs[item.id].length : 0;

      dropdown.append(tmpl({
        item: item,
        index: index,
        count: count
      }));
    });

    dropdown.data('height', resources.jobCategories.length * 25);

    var careerView = new CareerView(resources);
    var projectsView = new ProjectsView(resources.projects);

    var Router = Backbone.Router.extend({
      routes: {
        '': 'activateHome',
        'about': 'activateAbout',
        'contacts': 'activateContacts',
        'projects': 'activateProjects',
        'projects/:id': 'activateCurrentProject',
        'career': 'activateCareer',
        'career/type=:id': 'showJobsByID',
        'career/job=:id': 'showJob'
      },

      content: $('#content-container'),

      activateHome: function(){
        $.fn.switchTab();
        this.content.find('#content').html(resources.loadRes('home/', 'html'));
      },

      activateAbout: function(){
        $.fn.switchTab($('#about'));
        this.content.find('#content').html(resources.loadRes('about/', 'html'));
      },

      activateContacts: function(){
        $.fn.switchTab($('#contacts'));
        this.content.find('#content').html(resources.loadRes('contacts/', 'html'));
      },

      activateProjects: function(){
        $.fn.switchTab($('#projects'));
        projectsView.render();
      },

      activateCurrentProject: function(id){
        $.fn.switchTab($('#projects'));
        projectsView.render(id);
      },

      activateCareer: function(){
        $.fn.switchTab($('#career'));
        careerView.render();
      },

      showJobsByID: function(id){
        $.fn.switchTab($('#career'));
        careerView.showJobs(id);
      },

      showJob: function(id){
        $.fn.switchTab($('#career'));
        careerView.showJob(id);
      }
    });

    var router = new Router();

    Backbone.history.start();
  });
});