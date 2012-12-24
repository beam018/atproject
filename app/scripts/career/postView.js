define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var PostView = Backbone.View.extend({
    tagName: 'div',
    className: 'tab-pane fade',
    template: $('#post-template'),
    render: function(){
      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template(this.model.toJSON());

      this.$el.html(html);
      this.$el.attr('id', 'tab' + this.model.toJSON().id);
      return this;
    }
  });

  return PostView;
});