define([
    'backbone',
    'career/collections/jobsList',
    'career/jobsView'
  ], function(Backbone, JobsList, JobsView){
  'use strict';

  var JobsListView = Backbone.View.extend({
    tagName: 'div',
    className: 'career-category',
    template: $('#job-category-template').html(),

    initialize: function(jobCategories, jobCollection){
      this.collection = jobCategories;
      this.jobCollection = jobCollection;
      this.render();
    },

    render: function(){
      var self = this;
      _.each(this.collection.models, function(item){

        var category = item.toJSON();
        category.jobsCount = self.jobCollection.where({category: item.id}).length;

        var tmpl = _.template(this.template);
        this.$el.append(tmpl(category));
      }, this);

      return this;
    },
  });

  return JobsListView;
});