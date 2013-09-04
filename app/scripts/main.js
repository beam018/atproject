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
    'jquery.xdr': {
      deps: ['jquery']
    },
    'jquery.mousewheel': {
      deps: ['jquery']
    },
    'lightbox.media': {
      deps: ['lightbox']
    },
    'lightbox': {
      deps: ['jquery', 'jquery.mousewheel']
    }
  },

  paths: {
    'jquery': '../components/jquery/jquery',
    'jquery.xdr': '../components/jquery.xdomainrequest/jQuery.XDomainRequest',
    'jquery.mousewheel': 'vendor/jquery.mousewheel-3.0.6.pack',
    'underscore': '../components/underscore/underscore',
    'backbone': '../components/backbone-amd/backbone',
    'lightbox': 'vendor/jquery.fancybox.pack',
    'lightbox.media': 'vendor/jquery.fancybox-media'
  }
});

require(
  ['jquery', 'underscore', 'utils', 'app', 
    'config', 'lightbox', 'lightbox.media'],
  function($, _, utils, App, config) {
    'use strict';

    $('html').removeClass('no-js');

    // fancybox
    var fbImageHandler = function(e){
      e.preventDefault();
      $(this).fancybox().click();
      $(document).one('click', '.fancybox', fbImageHandler);
    };

    var fbVideoHandler = function(e) {
      e.preventDefault();
      $(this).fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
          media : {}
        }
      }).click();
      $(document).one('click', '.fancybox-media', fbVideoHandler);
    };

    $(document).one('click', '.fancybox', fbImageHandler);
    $(document).one('click', '.fancybox-media', fbVideoHandler);

    if($('body').hasClass('ie')){
      $('body .fancybox').click();
    }

    // generate dropdown menu
    var resources = utils.resources;
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
    var showDropdown = function(){
      dropdown.height(dropdown.data('height'));
      dropdown.children('li').map(function(index, item){
        // plus padding top
        $(item).css('margin-top', ($('a', item).data('index') + 1) * 25 + 'px');
        $(item).css('z-index', 1000 - $('a', item).data('index'));
      });
    };

    var hideDropdown = function(){
      dropdown.children('li').css('margin-top', 0);
    };

    dropdown.parent('li').on('mouseenter', showDropdown);
    dropdown.parent('li').on('mouseleave', hideDropdown);
    dropdown.parent('li').on('click', hideDropdown);

    dropdown.children('li').on('click', function(){
      window.location = $(this).find('a').attr('href');
    });

    if(!config.social){
      $('footer div.social').hide();
    }

    App.initialize();
    $('#content').removeClass('loading');

    utils.debug.log('App initialised');
    utils.debug.log('Done!');
  }
);