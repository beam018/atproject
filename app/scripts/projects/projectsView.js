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
      this.container = $('<div class="row-fluid projects-row"></div>');

      _.each(this.collection.toJSON(), function(item){
        this.container.append(this.renderProject(item));
      }, this);
    },

    render: function(){
      this.carouselView = new CarouselView(this.collection);
      this.carouselView.render();

      this.$el.html(this.carouselView.el);
      this.$el.append(this.container);
    },

    renderProject: function(item){
      var projectView = new ProjectView({model: item});
      projectView.render();
      
      return projectView.el;
    },

    renderCurent: function(id){
      if(!this.carouselView){
        this.render();
        this.carouselView.renderCurent(id);
      }
      else{
        this.carouselView.renderCurent(id);
      }
    }
  });

  return ProjectsView;
});