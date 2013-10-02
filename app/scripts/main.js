require.config({
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'switchTab': {
      deps: ['jquery']
    },
    'clearBase': {
      deps: ['jquery']
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'jquery.mousewheel': {
      deps: ['jquery']
    },
    'lightbox.media': {
      deps: ['lightbox']
    },
    'lightbox.thumbs': {
      deps: ['lightbox']
    },
    'lightbox': {
      deps: ['jquery', 'jquery.mousewheel']
    }
  },

  paths: {
    'jquery': '../components/jquery/jquery',
    'jquery.mousewheel': 'vendor/jquery.mousewheel-3.0.6.pack',
    'underscore': '../components/underscore/underscore',
    'backbone': '../components/backbone-amd/backbone',
    'lightbox': 'vendor/jquery.fancybox',
    'lightbox.media': 'vendor/jquery.fancybox-media',
    'lightbox.thumbs': 'vendor/jquery.fancybox-thumbs'
  }
});

require(
  ['jquery', 'underscore', 'utils', 'app', 
    'config', 'lightbox', 'lightbox.media', 'lightbox.thumbs'],
  function($, _, utils, App, config) {
    'use strict';

    $('html').removeClass('no-js');

    // fancybox
    var fbImageHandler = function(e){
      e.preventDefault();
      $(this).fancybox({
        openEffect  : 'fade',
        closeEffect : 'fade',
        nextEffect: 'fade',
        prevEffect: 'fade',
        openSpeed: 500,
        tpl: {
            closeBtn: '<div title="Close" class="fancybox-item fancybox-close">X</div>'
        },
        overlay : {
          speedOut   : 500
        }
      }).click();
      $(document).one('click', '.fancybox', fbImageHandler);
    };

    var fbVideoHandler = function(e) {
      e.preventDefault();
      $(this).fancybox({
        openEffect  : 'fade',
        openSpeed: 500,
        closeEffect : 'fade',
        nextEffect: 'fade',
        prevEffect: 'fade',
        helpers : {
          media : {}
        },
        tpl: {
            closeBtn: '<div title="Close" class="fancybox-item fancybox-close">X</div>'
        },
        overlay : {
          speedOut   : 500
        }
      }).click();
      $(document).one('click', '.fancybox-media', fbVideoHandler);
    };

    var fbThumbHelper = function(e){
      e.preventDefault();
      $(this).fancybox({
        openEffect  : 'fade',
        closeEffect : 'fade',
        nextEffect: 'fade',
        prevEffect: 'fade',
        openSpeed: 500,
        helpers : {
          title : {
            type: 'outside'
          },
          thumbs  : {
            width : 126,
            height  : 65
          }
        },
        tpl: {
            closeBtn: '<div title="Close" class="fancybox-item fancybox-close">X</div>'
        },
        overlay : {
          speedOut   : 0
        }
      }).click();
      $(document).one('click', '.fancybox-thumb', fbThumbHelper);
    };

    $(document).one('click', '.fancybox', fbImageHandler);
    $(document).one('click', '.fancybox-media', fbVideoHandler);
    $(document).one('click', '.fancybox-thumb', fbThumbHelper);

    if($('body').hasClass('ie')){
      $('body .fancybox').click();
    }

    $.fancybox.defaults['padding'] = [36, 6, 36, 6];

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

    if(!config.social){
      $('footer div.social').hide();
    }

    App.initialize();

    utils.debug.log('App initialised');
    utils.debug.log('Done!');
  }
);