define(['backbone'], function(Backbone){
  'use strict';

  var JobsView = Backbone.View.extend({
    tagName: 'div',
    // className: 'container with-shadow',
    template: $('#jobs-table-template').html(),
    render: function(data){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(data));
    }
  });

  return JobsView;
});