require.config({
  shim: {
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    }
  },

  paths: {
    // jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min',
    underscore: 'vendor/underscore-min',
    backbone: 'vendor/backbone-min'
  }
});

define('switchTab', [], function(){
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

require(['switchTab', 'app', 'config'], function(switchTab, app, config) {
  'use strict';

  var showDropdown = function(){
    dropdown.height(dropdown.data('height') + 50);
    dropdown.slideDown(150);
    dropdown.children('li').map(function(index, item){
      // plus padding top
      $(item).css('margin-top', ($('a', item).data('index') + 1) * 25 + 'px');
    });
    // dropdown.css('padding', '25px 0');
  };

  var hideDropdown = function(){
    dropdown.slideUp(150);
    dropdown.children('li').css('margin-top', 0);
  };

  var dropdown = $('#dropdown');
  dropdown.parent('li').on('mouseenter', function(){
    showDropdown();
  });

  dropdown.parent('li').on('mouseleave', function(){
    hideDropdown();
  });
});