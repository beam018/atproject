define([

    'backbone',
    'resources',
    'config',
    'career/collections/jobsList',
    'career/collections/jobCategories',
    'career/collections/cities',
    'career/jobsListView',
    'career/jobsView',
    'career/jobView'

  ], function(

      Backbone,
      resources,
      config,
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
    template: $('#career-template').html(),

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

    render: function(smooth){
      if(smooth !== false){
        smooth = true;
      }

      var $pages = $('#pages');
      var $page1 = $('#page-1');

      this.$el.addClass('rounded__crumbs');
      this.$el.addClass('light-border');

      if($page1[0]){
        $pages.css('margin-left', 0);
        this.$crumbs.children().first().nextAll().remove();
        return;
      }

      var tmpl = _.template(this.template);
      this.$el.html(tmpl({smooth: smooth}));
      var page = this.$el.find('#page-1');
      page.html(this.jobListView.el)
        .prepend(resources.loadRes('career/', 'html'));

      this.$crumbs = $('#crumbs');
      this.pageWidth = page.outerWidth();
    },

    addCrumb: function(link, name, fadeTime){
      if(fadeTime === undefined){
        fadeTime = 300;
      }
      var tmpl = _.template($('#crumb-template').html());
      this.$crumbs.append($(tmpl({
        name: name,
        link: link
      })).fadeIn(fadeTime));
    },

    activateLastCrumb: function(){
      this.$crumbs
        .children()
        .last()
        .addClass('active')
        .siblings()
        .removeClass('active');
    },

    showJobs: function(id){
      id = parseInt(id, 10);
      if(isNaN(id)){
        console.error('bad id');

        this.$el.html('');
        return;
      }

      var $pages = $('#pages');
      if(!$pages[0]){
        this.render(false);
        this.showJobs(id);
        $('#pages').addClass('pages__transition');
        return;
      }

      var jobs = _.map(this.jobsCollection.where({category: id}), function(item){
        return item.toJSON();
      });
      var category = this.jobCategoriesCollection.get(id).toJSON();
      var cities = [];
      _.map(this.citiesCollection.toJSON(), function(item){
        cities[item.id] = item.city_name;
      });

      var data = {
        jobs: jobs,
        category: category,
        cities: cities
      };

      this.jobsView.render(data);
      console.log(data);
      this.jobsView.$el.css(
        'background-image', 'url(' + config.mediaUrl + data.category.background + ')'
      );
      this.$('#page-1').after(this.jobsView.el);

      $pages.css('margin-left', -this.pageWidth);

      var urn = '#career/type=' + id;

      var readyCrumb = _.find($('.crumb a'), function(item){
        return $(item).attr('href') === urn;
      });

      if(!readyCrumb){
        this.$crumbs.children().first().nextAll().remove();
        this.addCrumb(urn, category.name);
      }
      this.$crumbs.children().first().next().nextAll().remove();
      this.activateLastCrumb();

      $('.career-table tbody tr').on('click', function(e){
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
      var category = this.jobCategoriesCollection.get(job.category).toJSON();
      var city = {};
      if(this.citiesCollection.get(job.city)){
        city = this.citiesCollection.get(job.city).toJSON();
      }

      var data = {
        job: job,
        category: category,
        city: city
      };

      var $pages = $('#pages');
      if(!$pages[0]){
        this.render(false);
        this.showJobs(category.id);
        this.showJob(id);
        // $('#pages').addClass('pages__transition');
        return;
      }

      if(!$('page-3')[0]){
        this.jobView.render(data);
        this.$('#page-2').after(this.jobView.el);
      }

      $pages.css('margin-left', -this.pageWidth * 2);

      var urn = '#career/job=' + id;

      var readyCrumb = _.find($('.crumb a'), function(item){
        return $(item).attr('href') === urn;
      });

      if(!readyCrumb){
        this.addCrumb(urn, job.name);
      }
      this.$crumbs.children().first().next().next().nextAll().remove();
      this.activateLastCrumb();

      // $('body').css();
      $('#content-container').addClass('content__fullsize');
      // $(document).scrollTop()

      $('#file-input').on('click', function(e){
        e.preventDefault();
        if(e.currentTarget === this && e.target.nodeName !== 'INPUT') {
          $(this.control).click();
        }
      });

      $('#resume-field').on('change', function(e){
        $('#brows-field').val($('#resume-field')[0].files[0].name);
      });

      var frameLoad = false;
      $('#upload-target').load(function(){
        if(!frameLoad){
          frameLoad = true;
        }else{
          alert('data was arrived');
        }
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

      $('#contact-form').attr('action', config.serverUrl + 'mail/');
    }
  });

  return CareerView;
});