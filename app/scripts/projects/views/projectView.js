define(['backbone'], function(Backbone){
  'use strict';

  var ProjectView = Backbone.View.extend({
    tagName: 'a',
    className: 'container with-shadow',
    template: $('#project-template').html(),

    initialize: function(){
      this.render();
    },

    render: function(){
      var tmpl = _.template(this.template);
      var html = tmpl(this.model);

      this.$el
        .html(html)
        .attr('href', '#projects/' + this.model.id)
        .attr('id', 'project-' + this.model.id)
        .addClass('thumb-link');
    }
  });

  return ProjectView;
});