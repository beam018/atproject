define([
  'jquery',
  'underscore',
  'config',
  'resources',
  'backbone',
  'career/views/careerView',
  'projects/views/projectsView'
], function($, _, config, resources, Backbone, CareerView, ProjectsView){
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

  var initialize = function(){
    var router = new Router;

    var careerView = new CareerView(resources);
    var projectsView = new ProjectsView(resources.projects);

    var content = $('#content-container');

    router.on('route:activateHome', function(){
      $.fn.switchTab();

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html('<div class="career-content">'+
          resources.loadRes('home/', 'html')+
          '</div>');
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateAbout', function(){
      $.fn.switchTab($('#about'));

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html('<div class="career-content">'+
          resources.loadRes('about/', 'html')+
          '</div>');
        content.fadeIn(config.fadeTime);
      });
    });

    router.on('route:activateContacts', function(){
      $.fn.switchTab($('#contacts'));

      content.fadeOut(config.fadeTime, function(){
        $.fn.clearBase();
        content.find('#content').html('<div class="career-content">'+
          resources.loadRes('contacts/', 'html')+
          '</div>');
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

    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});