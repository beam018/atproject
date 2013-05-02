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
      'career?no-fade=:fade': 'activateCareer',
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

    var delay = function(callback){
      setTimeout(callback, config.fadeTime);
    }

    var clearBase = function(){
      if(!_.find(arguments, function(item){return item == 'projects';})){
        $('#content-container').removeClass('content__fullsize');
        $contentContainer.removeClass('slide');
        $contentContainer.removeClass('colored');
        $contentContainer.addClass('single');
        $contentContainer.parent().siblings().remove();
      }

      if(!_.find(arguments, function(item){return item == 'career';})){
        $contentContainer.removeClass('rounded__crumbs');
        $contentContainer.removeClass('light-border');
      }
    };

    var switchTab = function(target){
      utils.debug.log(target);
      if(!target){
        $('#nav').find('li.active').map(function(index, item){
          $(item).removeClass('active');
        });
      }

      $(target)
        .parents('li')
        .addClass('active')
        .siblings('li.active')
        .removeClass('active');
    };

    var careerView = new CareerView();
    var projectsView = new ProjectsView();

    var $content = $('#content-container');
    var $contentContainer = $('#content');

    router.on('route:routeStart', function(e){
      clearBase();
      $content.addClass('fadeOut');

      delay(function(){
        router.trigger('route.fadeOutFinish')
      });
    });

    router.on('route.fadeOutFinish', function(){
      $content.removeClass('fadeOut');
    })

    router.on('route:activateHome', function(){
      switchTab();
      router.trigger('route:routeStart');

      delay(function(){
        $content.find('#content').html(wrapPage(pages.home))
      });
    });

    router.on('route:activateAbout', function(){
      switchTab($('#about'));
      router.trigger('route:routeStart');

      delay(function(){
        $content.find('#content').html(wrapPage(pages.about))
      });
    });

    router.on('route:activateContacts', function(){
      switchTab($('#contacts'));
      router.trigger('route:routeStart');

      delay(function(){
        $content.find('#content').html(wrapPage(pages.contacts));
      });
    });

    router.on('route:activateProjects', function(){
      switchTab($('#projects'));
      router.trigger('route:routeStart');

      delay(function(){
        projectsView.render();
      });
    });

    router.on('route:activateCurrentProject', function(id){
      switchTab($('#projects'));
      clearBase('projects');
      projectsView.render(id);
    });

    router.on('route:activateCareer', function(noFade){
      switchTab($('#career'));

      if(noFade){
        careerView.render();
        return;
      }

      router.trigger('route:routeStart');

      delay(function(){
        careerView.render();
      });
    });

    router.on('route:showJobsByID', function(id){
      switchTab($('#career'));
      clearBase('career');
      careerView.showJobs(id);
    });

    router.on('route:showJob', function(id){
      switchTab($('#career'));
      clearBase('career');
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
