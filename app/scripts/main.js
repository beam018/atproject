require.config({
  shim: {
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  },

  paths: {
    // jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min',
    underscore: 'vendor/underscore-min',
    backbone: 'vendor/backbone-min',
    handlebars: 'vendor/handlebars'
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
});
 
require(['switchTab', 'app'], function(switchTab, app) {
  'use strict';

  $('a').on('click', function(){
    var $content = $('#content');
    if($content.hasClass('content-unfix')){
      $content.removeClass('content-unfix');
    }
  });
});