define([
    'handlebars',
    'backbone',
    'career/collections/jobsList',
    'career/jobsView'
  ], function(handlebars, Backbone, JobsList, JobsView){
  'use strict';

  handlebars.registerHelper('length', function(val){
    return new handlebars.SafeString(val.length);
  });

  var JobsListView = Backbone.View.extend({
    tagName: 'div',
    className: 'row-fluid job-preview-list',
    template: $('#job-list-template'),

    initialize: function(collection){
      this.collection = collection;
      this.render();
    },

    render: function(){
      _.each(this.collection.models, function(item){
        var templateSource = this.template.html();
        var template = handlebars.compile(templateSource);
        var html = template(item.toJSON());

        this.$el.append(html);
      }, this);

      return this;
    },
  });

  return JobsListView;
});