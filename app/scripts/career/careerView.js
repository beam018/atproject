define([

    'handlebars',
    'backbone',
    'career/tabView',
    'career/postView',
    'career/collections/tabs',
    'career/collections/jobsList',
    'career/collections/jobCategories',
    'career/collections/cities',
    'career/jobsListView',
    'career/jobsView',
    'career/jobView'

  ], function(

      handlebars,
      Backbone,
      TabView,
      PostView,
      Tabs,
      JobsList,
      JobCategories,
      Cities,
      JobsListView,
      JobsView,
      JobView

    ){

  'use strict';

  handlebars.registerHelper('getCityById', function(iterator, id){
    if(!iterator){
      return '';
    }

    if(!_.isNumber(id)){
      return '';
    }

    var result = iterator[id];
    if(_.isUndefined(result)){
      return '';
    }

    return new handlebars.SafeString(result.city_name);
  });

  var CareerView = Backbone.View.extend({
    el: $('#content'),
    $tabs: $('<ul id="myTab" class="nav nav-tabs"></ul>'),
    $posts: $('<div id="myTabContent" class="tab-content posts-container"></div>'),

    initialize: function(resources){
      this.tabsCollection = new Tabs(resources.tabs);
      this.jobsCollection = new JobsList(resources.jobs);
      this.jobCategoriesCollection = new JobCategories(resources.jobCategories);
      this.citiesCollection = new Cities(resources.cities);

      this.jobsView = new JobsView();
      this.jobView = new JobView();

      this.jobListView = new JobsListView(
        this.jobCategoriesCollection,
        this.jobsCollection
      );
    },

    render: function(){
      this.$el.html(this.jobListView.el);
      
      this.$tabs.html('');
      _.each(this.tabsCollection.models, function(item){
        this.renderTab(item);
        this.renderPost(item);
      }, this);
    },

    renderTab: function(item){
      var tabView = new TabView({model: item});
      this.$tabs.append(tabView.render().el);

      this.$el.append(this.$tabs);
    },

    renderPost: function(item){
      var postView = new PostView({model: item});
      this.$posts.append(postView.render().el);

      this.$el.append(this.$posts);
    },

    showJobs: function(id){
      id = parseInt(id, 10);
      if(isNaN(id)){
        console.error('bad id');

        this.$el.html('');
        return;
      }

      var category = this.jobCategoriesCollection.get(id).toJSON();
      var jobs = _.map(this.jobsCollection.where({category: id}), function(item){
        return item.toJSON();
      });
      var cities = [];
      this.citiesCollection.each(function(item){
        cities[item.id] = item.toJSON();
      });

      var data = {
        category: category,
        jobs: jobs,
        cities: cities
      };

      this.jobsView.render(data);
      this.$el.html(this.jobsView.el);
    },

    showJob: function(id){
      id = parseInt(id, 10);
      if(isNaN(id)){
        console.error('bad id');
        return;
      }

      var job = this.jobsCollection.get(id).toJSON();
      var category = this.jobCategoriesCollection.get(job.category).toJSON();

      this.jobView.render({
        job: job,
        category: category
      });
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