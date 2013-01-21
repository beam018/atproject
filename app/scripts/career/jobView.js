define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var JobView = Backbone.View.extend({
    tagName: 'div',
    template: $('#job-template'),
    render: function(data){
      console.log(data);

      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template(data);

      this.$el.html(html);
    }
  });

  return JobView;
});