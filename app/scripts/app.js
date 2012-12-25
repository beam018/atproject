define([
  'resources',
  'handlebars',
  'backbone',
  'career/careerView',
  'projects/projectsView'
], function(resources, handlebars, Backbone, CareerView, ProjectsView){
  'use strict';

  $(document).ready(function(){

    var dropdown = $('#dropdown');

    var templateSource = $('#dropdown-item-template').html();
    var template = handlebars.compile(templateSource);

    _.each(resources.jobs, function(item){
      dropdown.append(template(item));
    });

    var careerView = new CareerView(resources.tabs, resources.jobs);
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
        'career/type=:parentId/job=:id': 'showJob'
      },

      content: $('#content'),

      activateHome: function(){
        $.fn.switchTab();
        this.content.html(resources.loadRes('home.json').content);
      },

      activateAbout: function(){
        $.fn.switchTab($('#about'));
        this.content.html(resources.loadRes('about.json').content);
      },

      activateContacts: function(){
        $.fn.switchTab($('#contacts'));
        this.content.html(resources.loadRes('contacts.json').content);
      },

      activateProjects: function(){
        $.fn.switchTab($('#projects'));
        projectsView.render();
      },

      activateCurrentProject: function(id){
        $.fn.switchTab($('#projects'));
        projectsView.renderCurent(id);
      },

      activateCareer: function(){
        $.fn.switchTab($('#career'));
        careerView.render();
        careerView.$tabs.find('a').first().tab('show');

        $('#myTab a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
        });
      },

      showJobsByID: function(id){
        $.fn.switchTab($('#career'));
        careerView.showJobs(id);
      },

      showJob: function(parentId, id){
        $.fn.switchTab($('#career'));
        careerView.showJob(parentId, id);
      }
    });

    var router = new Router();

    Backbone.history.start();
  });
});