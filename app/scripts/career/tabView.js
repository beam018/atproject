define([
    'handlebars',
    'backbone'
  ], function(handlebars, Backbone){
  'use strict';

  var TabView = Backbone.View.extend({
    tagName: 'li',
    template: $('#tab-template'),
    render: function(){
      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template(this.model.toJSON());

      this.$el.html(html);
      return this;
    }
  });

  return TabView;
});