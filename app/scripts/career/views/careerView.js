define([

    'jquery',
    'underscore',
    'backbone',
    'resources',
    'config',
    'career/collections/jobsList',
    'career/collections/jobCategories',
    'career/collections/cities',
    'career/views/jobsListView',
    'career/views/jobsView',
    'career/views/jobView'

  ], function(

      $,
      _,
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
      var content = tmpl({
        name: name,
        link: link
      });
      this.$crumbs.append(content).children('.crumb').fadeIn(fadeTime);
    },

    activateLastCrumb: function(){
      this.$crumbs
        .children()
        .last()
        .addClass('active')
        .siblings()
        .removeClass('active');
    },

    showErrorTooltip: function($target, msg){
      var $fieldContainer = $target.parent('div');

      var tooltipErrorTmplSrc = $('#tooltip-error-template').html();
      var tooltipErrorTmpl = _.template(tooltipErrorTmplSrc);

      var targetId = $target.attr('id');
      if(!msg && (targetId === 'phone-field' || targetId === 'email-field')){
        var regexp = /^[а-яА-Яa-zA-Z]+/;
        var nameSource = $fieldContainer.find('label').html();
        var name = regexp.exec(nameSource)[0];

        msg = 'Неверно заполнили поле "' + name + '"';
      }

      if(!msg || !_.isString(msg)){
        msg = 'Не заполнили';
      }

      var oldTooltip = $fieldContainer.find('.tooltip');
      if(oldTooltip[0]){
        oldTooltip.find('p').html(msg);
        return;
      }

      var tooltip = tooltipErrorTmpl({msg: msg});
      $fieldContainer.append(tooltip);
      $fieldContainer.find('.tooltip').fadeIn(config.fadeTime);

      $target.addClass('error');
    },

    removeErrorTooltip: function($target){
      $target.parent('div')
        .find('.tooltip')
        .fadeOut(config.fadeTime, function(){
          $(this).remove();
        });
      $target.removeClass('error');
    },

    validateField: function($target){
      if(!$target.val()){
        var msg = 'Не заполнили';
        this.showErrorTooltip($target, msg);
        return false;
      }

      if($target.attr('id') === 'phone-field'){
        var phoneRegexp = /^\+?[0-9]{1,3}[-. (]?\(?([0-9]{3})\)?[)-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/;
        if(!phoneRegexp.test($target.val())){
          this.showErrorTooltip($target);
          return false;
        };
      }

      if($target.attr('id') === 'email-field'){
        var emailRegexp = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/;
        if(!emailRegexp.test($target.val())){
          this.showErrorTooltip($target);
          return false;
        };
      }

      if($target.val()){
        this.removeErrorTooltip($target);
      }

      return true;
    },

    validateAll: function(){
      var $fields = $('input');
      var errors = false;

      for(var i=0; i<$fields.length; i++){
        if(!this.validateField($($fields[i]))){
          errors = true;
        }
      }

      return !errors;
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

      $('#content-container').addClass('content__fullsize').scrollTop(0);

      $('#file-input').on('click', function(e){
        e.preventDefault();
        if(e.currentTarget === this && e.target.nodeName !== 'INPUT') {
          $(this.control).click();
        }
      });

      $('#resume-field').on('change', function(e){
        $('#brows-field').val($('#resume-field')[0].files[0].name);
      });

      var self = this;
      var $fields = $('input');
      $fields.on('focusout keyup', function(e){
        var $target = $(this);
        var $fieldContainer = $target.parent('div');

        if(e.type === 'keyup' && e.keyCode === 9){
          return;
        };

        self.validateField($target);
      });

      var $submitBtn = $('#submit');
      $('#resume-field').on('change', function(){
        if(self.validateAll()){
          $submitBtn.attr('disabled', false);
        }
      });

      var submit = false;
      $submitBtn.on('click', function(){
        if(self.validateAll()){
          submit = true;
        }
        else{
          $submitBtn.attr('disabled', true);
        }
      });

      var frameLoad = false;
      $('#upload-target').load(function(){
        if(!frameLoad){
          frameLoad = true;
        }else if(submit){
          var $alert = $('#alert');
          $alert.fadeIn(config.fadeTime);
          setTimeout(function(){
            $alert.fadeOut(config.fadeTime);
          }, 7000);

          $submitBtn.hide();
          $fields.each(function(index, field){
            $(field).val('');
          });
          $('textarea').val('');
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
