define([
    'jquery',
    'underscore',
    'backbone'
  ], function($, _, Backbone){
    'use strict';

    var JobsListView = Backbone.View.extend({
      tagName: 'div',
      className: 'career-category',
      template: $('#job-category-template').html(),

      initialize: function(jobCategories){
        this.render();
      },

      render: function(){
        var self = this;
        _.each(this.collection.models, function(item){
          var tmpl = _.template(this.template);
          this.$el.append(tmpl(item.toJSON()));
        }, this);

        return this;
      }
    });

    return JobsListView;
  });
