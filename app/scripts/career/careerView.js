define([

    'config',
    'handlebars',
    'backbone',
    'career/tabView',
    'career/postView',
    'career/collections/tabs',
    'career/collections/jobsList',
    'career/jobsListView',
    'career/jobsView',
    'career/jobView'

  ], function(

      config,
      handlebars,
      Backbone,
      TabView,
      PostView,
      Tabs,
      JobsList,
      JobsListView,
      JobsView,
      JobView

    ){

  'use strict';

  var CareerView = Backbone.View.extend({
    el: $('#content'),
    $tabs: $('<ul id="myTab" class="nav nav-tabs"></ul>'),
    $posts: $('<div id="myTabContent" class="tab-content posts-container"></div>'),

    initialize: function(tabsData, jobsData){
      this.tabsCollection = new Tabs(tabsData);
      this.jobsCollection = new JobsList(jobsData);

      this.jobsView = new JobsView();
      this.jobView = new JobView();

      this.jobListView = new JobsListView(this.jobsCollection);
    },

    render: function(){
      this.$tabs.html('');

      _.each(this.tabsCollection.models, function(item){
        this.renderTab(item);
        this.renderPost(item);
      }, this);

      this.$el.append($('<div class="career-wrapper"></div>'));

      this.$el.append(this.jobListView.el);
    },

    renderTab: function(item){
      var tabView = new TabView({model: item});
      this.$tabs.append(tabView.render().el);

      this.$el.html(this.$tabs);
    },

    renderPost: function(item){
      var postView = new PostView({model: item});
      this.$posts.append(postView.render().el);

      this.$el.append(this.$posts);
    },

    showJobs: function(id){
      var data = this.jobsCollection.get(id);
      
      this.jobsView.render(data.toJSON());
      this.$el.html(this.jobsView.el);
    },

    showJob: function(parentId, id){
      this.jobView.render(this.jobsCollection, parentId, id);
      this.$el.html(this.jobView.el);
      this.$el.addClass('content-unfix');

      new Ya.share({
        element: 'yashare',
        elementStyle: {
          type: 'none',
          quickServices: [
            'vkontakte',
            'facebook',
            'twitter',
            'odnoklassniki',
            'moimir',
            'gplus'
          ]
        }
      });
    }
  });

  return CareerView;
});