define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var JobsView = Backbone.View.extend({
    tagName: 'div',
    template: $('#jobs-template'),
    render: function(data){
      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template(data);

      this.$el.html(html);
    }
  });

  return JobsView;
});