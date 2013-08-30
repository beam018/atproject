define([
  'jquery',
  'config',
  'utils',
  'backbone',
  'career/views/careerView',
  'pages/views/pagesView',
  'pages/views/contactsView',
  'posts/views/postView'
], function(
    $, config, utils, Backbone, CareerView, PagesView, ContactsView, PostView
  ){
  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'career?no-fade=:fade': 'activateCareer',
      'career': 'activateCareer',
      'career/type=:id': 'showJobsByID',
      'career/job=:id': 'showJob',
      'contacts?no-fade=:fade': 'activateContacts',
      'contacts': 'activateContacts',
      'contacts/:id': 'showContact',
      'posts': 'activatePosts',
      '': 'activatePages',
      ':page': 'activatePages',
      ':page/:id': 'activateCurrentPage'
    }
  });
  utils.debug.log('routes headers created');

  var initialize = function(){
    var resources = utils.resources;
    var pages = resources.pages;

    var router = new Router();

    var $content = $('#content-container');
    var $contentContainer = $('#content');

    var delay = function(callback, time){
      setTimeout(callback, time || config.fadeTime);
    }

    var clearBase = function(){
      // clear micro UI changes on page
      if(!_.find(arguments, function(item){return item == 'pages';})){
        $('#content-container').removeClass('content__fullsize');
        $contentContainer.removeClass('slide');
        $contentContainer.removeClass('colored');
        $contentContainer.addClass('single');
        $contentContainer.parent().siblings().remove();
      }

      if(!_.find(arguments, function(item){return item == 'career';})){
        $contentContainer.removeClass('rounded__crumbs');
      }
    };

    var switchTab = function(target){
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
    var contactsView = new ContactsView(resources.contacts);
    var postView = new PostView();
    var pagesViews = [];

    for(var key in pages){
      if(!pages[key][0]) continue;
      pagesViews[key] = new PagesView(pages[key], key);
    }

    var notFound = function(err){
      try{
        pagesViews['notFound'].render();
      }
      catch(err){
        utils.debug.error(err.message);
        utils.debug.warn('No pages of this type');
        $contentContainer.html('');
      }
    };

    router.on('route:routeStart', function(e){
      $content.addClass('fadeOut');

      delay(function(){
        clearBase();
      }, config.fadeTime / 2);

      delay(function(){
        router.trigger('route.fadeOutFinish')
      });
    });

    router.on('route.fadeOutFinish', function(){
      $content.removeClass('fadeOut');
    })

    router.on('route:activatePages', function(page){
      if(page === 'home' || page === undefined){
        switchTab();
        page = 'home';
      }
      else{
        switchTab($('#' + page));
      }
      router.trigger('route:routeStart');

      delay(function(){
        try{
          pagesViews[page].render();
        }
        catch(err){
          notFound(err);
        }
      }, config.fadeTime / 2);
    });

    router.on('route:activateCurrentPage', function(page, id){
      if(page === 'home' || page === undefined){
        switchTab();
        page = 'home';
      }
      else{
        switchTab($('#' + page));
      }
      clearBase('pages');
      try{
        pagesViews[page].render(id);
      }
      catch(err){
        notFound(err);
      }
    });

    router.on('route:activateCareer', function(noFade){
      switchTab($('#career'));

      if(noFade){
        clearBase('career');
        careerView.render();
        return;
      }

      router.trigger('route:routeStart');

      delay(function(){
        careerView.render();
      });
    });

    router.on('route:activatePosts', function(){
      switchTab($('#posts'));
      router.trigger('route:routeStart');
      delay(function(){
        postView.render();
      });
    });

    router.on('route:activateContacts', function(noFade){
      switchTab($('#contacts'));

      if(noFade){
        clearBase('career');
        contactsView.render(noFade);
        return;
      }

      router.trigger('route:routeStart');

      delay(function(){
        contactsView.render();
      });
    });

    router.on('route:showContact', function(id){
      switchTab($('#contacts'));
      clearBase('career');
      contactsView.showContact(id);
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
