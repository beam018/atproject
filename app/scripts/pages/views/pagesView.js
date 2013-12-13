define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'pages/collections/pages',
    'pages/views/pageView',
    'pages/views/carouselView'
  ], function($, _, Backbone, utils, Pages, PageView, CarouselView){
    'use strict';

    var PagesView = Backbone.View.extend({
      el: $('#content'),

      initialize: function(collection, pageName){
        this.collection = new Pages(collection);
        this.container = $('<div class="grid-row slider-row"></div>');
        this.pageName = pageName;

        _.each(this.collection.toJSON(), function(item){
          this.container.append(this.renderProject(item));
        }, this);

        this.carouselView = new CarouselView({
          collection: this.collection
        });

        utils.debug.log('carousel view initialized');
        utils.debug.log('pages view initialized');
      },

      render: function(id){
        if(isNaN(parseInt(id, 10))){
          if(!this.collection.at(0)){
            utils.debug.warn('no pages');
            return;
          }
          id = this.collection.at(0).id;
        }

        this.carouselView.render(id, this.pageName);
        utils.debug.log('carousel view rendered');

        if(!this.$el.hasClass('slide') && this.collection.length > 1){
          this.$el.removeClass('single').addClass('slide colored');
          this.$el.parents('#content-container').append(this.container);
        }

        $('#project-' + id)
          .addClass('active')
          .siblings()
          .removeClass('active');

        utils.debug.log('page rendered');
      },

      renderProject: function(item){
        var pageView = new PageView({model: item});

        var grid = 'grid6';

        switch(this.collection.length){
          case 2:
            grid = 'grid2';
            break;

          case 3:
            grid = 'grid3';
            break;

          case 4:
            grid = 'grid4';
            break;

          default:
            grid = 'grid6';
        }

        $(pageView.el).addClass(grid);

        utils.debug.log( '- ' + item.caption + ' thumb rendered');
        return pageView.el;
      }
    });

    return PagesView;
  });