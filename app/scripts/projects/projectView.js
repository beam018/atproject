define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var ProjectView = Backbone.View.extend({
    tagName: 'a',
    className: 'span3 projects-set',
    template: $('#project-template'),
    render: function(){
      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template(this.model);

      this.$el
        .html(html)
        .attr('href', '#projects/' + this.model.id)
        .css('background', 'url(' + this.model.thumb + ')');
    }
  });

  return ProjectView;
});