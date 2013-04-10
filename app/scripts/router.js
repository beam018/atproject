define([
  'jquery',
  'config',
  'utils',
  'backbone',
  'career/views/careerView',
  'projects/views/projectsView'
], function($, config, utils, Backbone, CareerView, ProjectsView){
  'use strict';

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
    }
  });
  utils.debug.log('routes headers created');

  var initialize = function(){
    var resources = utils.resources;
    var pages = resources.pages;

    var router = new Router();

    var wrapPage = function(page){
      return '<div class="career-content">' + page + '</div>';
    };

    var careerView = new CareerView();
    var projectsView = new ProjectsView();

    var content = $('#content-container');

    router.on('route:activateHome', function(){
      $.fn.switchTab();

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html(wrapPage(pages.home));
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateAbout', function(){
      $.fn.switchTab($('#about'));

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html(wrapPage(pages.about));
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateContacts', function(){
      $.fn.switchTab($('#contacts'));

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html(wrapPage(pages.contacts));
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateProjects', function(){
      $.fn.switchTab($('#projects'));

      $.fn.clearBase();
      content.fadeOut(config.fadeTime, function(){
        projectsView.render();
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateCurrentProject', function(id){
      $.fn.switchTab($('#projects'));
      $.fn.clearBase('projects');
      projectsView.render(id);
    });

    router.on('route:activateCareer', function(){
      $.fn.switchTab($('#career'));

      $.fn.clearBase();
      content.fadeOut(config.fadeTime, function(){
        careerView.render();
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:showJobsByID', function(id){
      $.fn.switchTab($('#career'));
      $.fn.clearBase('career');
      careerView.showJobs(id);
    });

    router.on('route:showJob', function(id){
      $.fn.switchTab($('#career'));
      $.fn.clearBase('career');
      careerView.showJob(id);
    });

    utils.debug.log('routes handling function initialised');

    Backbone.history.start();

    utils.debug.log('history started');
  };

  return {
    initialize: initialize
  };
});