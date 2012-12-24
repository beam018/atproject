define([
    'backbone',
    'projects/collections/projects',
    'projects/projectView',
    'projects/carouselView'
  ], function(Backbone, Projects, ProjectView, CarouselView){
  'use strict';

  var ProjectsView = Backbone.View.extend({
    el: $('#content'),
    
    initialize: function(data){
      this.collection = new Projects(data);
      this.carouselView = new CarouselView();
    },

    render: function(id){
      var container = $('<div class="row-fluid projects-row"></div>');
      var data = this.collection.toJSON()
      _.each(data, function(item){
        container.append(this.renderProject(item));
      }, this);

      if(!id){
        id = 0;
      }
      this.carouselView.render(data[id]);
      this.$el.html(this.carouselView.el);
      $('#myCarousel').find('.item').first().addClass('active');

      this.$el.append(container);
    },

    renderProject: function(item){
      var projectView = new ProjectView({model: item});
      projectView.render();
      
      return projectView.el;
    },
  });

  return ProjectsView;
});