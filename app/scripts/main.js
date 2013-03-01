require.config({
  shim: {
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    },
  },

  paths: {
    // jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min',
    underscore: 'vendor/underscore-min',
    backbone: 'vendor/backbone-min',
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

// other

    var $content = $('#content');

    if($('#content-container').hasClass('content__fullsize')){
      $('#content-container').removeClass('content__fullsize');
    }

    if($content.hasClass('slide')){
      $content.removeClass('slide');
    }

    if($content.hasClass('colored')){
      $content.removeClass('colored');
    }

    if(!$content.hasClass('single')){
      console.log();
      $content.addClass('single');
    }

    $content.parent().siblings().remove();
  };
});

require(['switchTab', 'app'], function(switchTab, app) {
  'use strict';

  var dropdown = $('#dropdown');
  dropdown.parent('li').on('mouseenter', function(e){
    dropdown.show();
    dropdown.height(dropdown.data('height'));
    dropdown.css('padding', '25px 0');
  });

  dropdown.on('mouseleave', function(e){
    dropdown.height(0);
    dropdown.css('padding', '0');
    dropdown.hide();
  });  
});