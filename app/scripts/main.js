require.config({
  shim: {
    jquery: {
      exports: '$'
    },
    switchTab: {
      deps: ['jquery']
    },
    clearBase: {
      deps: ['jquery']
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  },

  paths: {
    jquery: '../components/jquery/jquery',
    underscore: '../components/underscore/underscore',
    backbone: '../components/backbone-amd/backbone'
  }
});

define('switchTab', ['jquery'], function($){
  $.fn.switchTab = function(target){
    if(!target){
      $('#main-header').find('li.active').map(function(index, item){
        $(item).removeClass('active');
      });
    }

    $(target)
      .parents('li')
      .addClass('active')
      .siblings('li.active')
      .removeClass('active');
  };
});

define('clearBase', ['jquery', 'underscore'], function($, _){
  $.fn.clearBase = function(args) {
    var $content = $('#content');

    if(!_.find(arguments, function(item){return item == 'projects';})){
      $('#content-container').removeClass('content__fullsize');
      $content.removeClass('slide');
      $content.removeClass('colored');
      $content.addClass('single');
      $content.parent().siblings().remove();
    }

    if(!_.find(arguments, function(item){return item == 'career';})){
      $content.removeClass('rounded__crumbs');
      $content.removeClass('light-border');
    }
  };
});

require(['jquery', 'underscore', 'utils', 'app', 'switchTab', 'clearBase'], function($, _, utils, App) {
  'use strict';

  var resources = utils.resources;

  // generate dropdown menu
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
  utils.debug.log('dropdown generated');

  // window resize handling
  var body = document.body;
  var $body = $(body);
  var leftOffset = body.getBoundingClientRect().left;
  $body.css('margin-left', leftOffset + 'px');

  $(window).resize(function(){
    $body.css('margin-left', 'auto');
    leftOffset = body.getBoundingClientRect().left;
    $body.css('margin-left', leftOffset + 'px');
  });

  // dropdown animation
  dropdown.data('height', resources.jobCategories.length * 25);

  var showDropdown = function(){
    dropdown.height(dropdown.data('height') + 50);
    dropdown.slideDown(150);
    dropdown.children('li').map(function(index, item){
      // plus padding top
      $(item).css('margin-top', ($('a', item).data('index') + 1) * 25 + 'px');
    });
  };

  var hideDropdown = function(){
    dropdown.slideUp(150);
    dropdown.children('li').css('margin-top', 0);
  };

  dropdown.parent('li').on('mouseenter', showDropdown);
  dropdown.parent('li').on('mouseleave', hideDropdown);

  dropdown.children('li').on('click', function(){
    window.location = $(this).find('a').attr('href');
  });

  App.initialize();
  utils.debug.log('App initialised');
  utils.debug.log('Done!');
});
