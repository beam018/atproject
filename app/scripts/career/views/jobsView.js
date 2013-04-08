define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
  'use strict';

  var JobsView = Backbone.View.extend({
    tagName: 'div',
    className: 'career-content',
    id: 'page-2',
    template: $('#jobs-table-template').html(),
    render: function(data){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(data));
    }
  });

  return JobsView;
});