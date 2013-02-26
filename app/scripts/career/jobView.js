define(['backbone'], function(Backbone){
  'use strict';

  var JobView = Backbone.View.extend({
    tagName: 'div',
    template: $('#job-template').html(),
    render: function(data){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(data));
    }
  });

  return JobView;
});