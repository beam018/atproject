define([
    'backbone',
    'projects/collections/projects',
    'projects/projectView',
    'projects/carouselView'
  ], function(Backbone, Projects, ProjectView, CarouselView){
  'use strict';

  var ProjectsView = Backbone.View.extend({
    el: $('#content'),

    initialize: function(collection){
      this.collection = new Projects(collection);
      this.container = $('<div class="grid-row slider-row"></div>');

      _.each(this.collection.toJSON(), function(item){
        this.container.append(this.renderProject(item));
      }, this);

      this.carouselView = new CarouselView({collection: this.collection});
    },

    render: function(id){
      if(isNaN(parseInt(id, 10))){
        id = this.collection.at(0).id;
      }

      this.carouselView.render(id);

      if(!this.$el.hasClass('slide')){
        this.$el.removeClass('single').addClass('slide colored');
        this.$el.parents('#content-container').append(this.container);
      }

      $('#project-' + id)
        .addClass('active')
        .siblings()
        .removeClass('active');
    },

    renderProject: function(item){
      var projectView = new ProjectView({model: item});
      $(projectView.el).addClass(
        this.collection.length <= 3 ? 'grid3' : 'grid6'
      );

      return projectView.el;
    }
  });

  return ProjectsView;
});