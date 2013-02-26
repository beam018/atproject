define([

    'backbone',
    'resources',
    'career/postView',
    'career/collections/jobsList',
    'career/collections/jobCategories',
    'career/collections/cities',
    'career/jobsListView',
    'career/jobsView',
    'career/jobView'

  ], function(

      Backbone,
      resources,
      PostView,
      JobsList,
      JobCategories,
      Cities,
      JobsListView,
      JobsView,
      JobView

    ){

  'use strict';

  var CareerView = Backbone.View.extend({
    el: $('#content'),

    initialize: function(resources){
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
      this.$el.html('<div class="crumbs hide" id="crumbs"><div class="crumb"><a href="#career">Вакансии</a><span></span></div></div>');
      this.$el.append('<div class="pages" id="pages"></div>');
      var page = $('<div class="career-content" id="page-1"></div>');
      this.$el
        .find('#pages')
        .html(page)
        .find('#page-1')
        .html(this.jobListView.el)
        .prepend(resources.loadRes('career/', 'html'));
    },

    showJobs: function(id){
      id = parseInt(id, 10);
      if(isNaN(id)){
        console.error('bad id');

        this.$el.html('');
        return;
      }

      if(!$('#pages')[0]){
        this.render();
      }

      var jobs = _.map(this.jobsCollection.where({category: id}), function(item){
        return item.toJSON();
      });
      var data = {
        jobs: jobs,
        category: this.jobCategoriesCollection.get(id).toJSON(),
        cities: this.citiesCollection.toJSON()
      };

      this.jobsView.render(data);
      console.log($('#pages'));
      console.log(this.$el);
      // this.$el.html(this.jobsView.el);
      $('#pages', this.$el).append(this.jobsView.el);

      $('.career-table tr').on('click', function(e){
        window.location = $(this).find('a').attr('href');
      });
    },

    showJob: function(id){
      id = parseInt(id, 10);
      if(isNaN(id)){
        console.error('bad id');
        return;
      }

      var job = this.jobsCollection.get(id).toJSON();
      var data = {
        job: job,
        category: this.jobCategoriesCollection.get(job.category).toJSON(),
        city: this.citiesCollection.get(job.city).toJSON()
      };

      this.jobView.render(data);
      this.$el.html(this.jobView.el);

      $('#content-container').addClass('content__fullsize');

      $('#resume-field').on('change', function(e){
        $('#brows-field').val($('#resume-field')[0].files[0].name);
      });

      /*new Ya.share({
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
      });*/
    }
  });

  return CareerView;
});