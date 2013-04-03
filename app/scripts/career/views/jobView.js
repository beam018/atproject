define(['underscore', 'backbone'], function(_, Backbone){
  'use strict';

  var JobView = Backbone.View.extend({
    tagName: 'div',
    className: 'career-content career-p',
    id: 'page-3',
    template: $('#job-template').html(),
    render: function(data){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(data));
    }
  });

  return JobView;
});