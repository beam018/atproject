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
      this.carouselView.render(id);

      this.$el.removeClass('single').addClass('slide colored');
      this.$el.parents('#content-container').append(this.container);
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