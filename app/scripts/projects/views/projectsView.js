define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'projects/collections/projects',
    'projects/views/projectView',
    'projects/views/carouselView'
  ], function($, _, Backbone, utils, Projects, ProjectView, CarouselView){
    'use strict';

    var ProjectsView = Backbone.View.extend({
      el: $('#content'),

      initialize: function(){
        this.collection = new Projects(utils.resources.projects);
        this.container = $('<div class="grid-row slider-row"></div>');

        _.each(this.collection.toJSON(), function(item){
          this.container.append(this.renderProject(item));
        }, this);

        this.carouselView = new CarouselView({collection: this.collection});
        utils.debug.log('carousel view initialized');
        utils.debug.log('projects view initialized');
      },

      render: function(id){
        if(isNaN(parseInt(id, 10))){
          if(!this.collection.at(0)){
            utils.debug.warn('no projects');
            return;
          }
          id = this.collection.at(0).id;
        }

        this.carouselView.render(id);
        utils.debug.log('carousel view rendered');

        if(!this.$el.hasClass('slide')){
          this.$el.removeClass('single').addClass('slide colored');
          this.$el.parents('#content-container').append(this.container);
        }

        $('#project-' + id)
          .addClass('active')
          .siblings()
          .removeClass('active');

        utils.debug.log('projects page rendered');
      },

      renderProject: function(item){
        var projectView = new ProjectView({model: item});
        $(projectView.el).addClass(
          this.collection.length <= 3 ? 'grid3' : 'grid6'
        );

        utils.debug.log( '- ' + item.caption + ' thumb rendered');
        return projectView.el;
      }
    });

    return ProjectsView;
  });