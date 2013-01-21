define([
    'handlebars',
    'backbone',
    'career/collections/jobsList',
    'career/jobsView'
  ], function(handlebars, Backbone, JobsList, JobsView){
  'use strict';

  handlebars.registerHelper('length', function(val){
    if(!val){
      return '';
    }

    return new handlebars.SafeString(val.length);
  });

  var JobsListView = Backbone.View.extend({
    tagName: 'div',
    className: 'row-fluid job-preview-list',
    template: $('#job-list-template'),

    initialize: function(jobCategories, jobCollection){
      this.collection = jobCategories;
      this.jobCollection = jobCollection;
      this.render();
    },

    render: function(){
      var self = this;
      _.each(this.collection.models, function(item){
        var templateSource = this.template.html();
        var template = handlebars.compile(templateSource);
        var html = template({
          item: item.toJSON(),
          count: self.jobCollection.where({category: item.id}).length
        });

        this.$el.append(html);
      }, this);

      return this;
    },
  });

  return JobsListView;
});