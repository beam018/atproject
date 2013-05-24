define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
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
      utils,
      config,
      JobsList,
      JobCategories,
      Cities,
      JobsListView,
      JobsView,
      JobView
  ){
    'use strict';

    var resources = utils.resources,
        pages = resources.pages;

    var CareerView = Backbone.View.extend({
      el: $('#content'),
      template: $('#career-template').html(),

      initialize: function(){
        this.jobsCollection = new JobsList(resources.jobs);
        this.jobCategoriesCollection = new JobCategories(resources.jobCategories);
        this.citiesCollection = new Cities(resources.cities);

        this.jobsView = new JobsView();
        this.jobView = new JobView();

        this.jobListView = new JobsListView(
          this.jobCategoriesCollection,
          this.jobsCollection
        );

        utils.debug.log('career view initialized');
      },

      _movePages: function(pos){
        var $pages = $('#pages');

        $pages.attr(
          'class',
          $pages
            .attr('class')
            .replace(/pages__translate-\d+/g, 'pages__translate-' + pos)
        );
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
        this.activateLastCrumb();
      },

      removeCrumbs: function($crumb, fadeTime){
        var self = this;
        $crumb.nextAll().each(function(index, item){
          $(item).fadeOut(config.fadeTime, function(){
            $(this).remove();
            self.activateLastCrumb();
          });
        });
      },

      activateLastCrumb: function(){
        this.$crumbs
          .children()
          .last()
          .addClass('active')
          .siblings()
          .removeClass('active');
      },

      render: function(smooth){
        if(smooth !== false){
          smooth = true;
        }

        var $page1 = $('#page-1');

        this.$el.addClass('rounded__crumbs');
        this.$el.addClass('light-border');

        var self = this;
        if($page1[0]){
          this._movePages(0);
          setTimeout(function(){
            self.removeCrumbs(self.$crumbs.children().first());
          }, config.animationTime)

          return;
        }

        var tmpl = _.template(this.template);
        this.$el.html(tmpl({smooth: smooth}));
        if(!FormData){
          var $iframe = $('<iframe id="upload-target" name="upload-target" src="/frame.html" style="display:none;"></iframe>');
          this.$el.append($iframe);
        }
        var page = this.$el.find('#page-1');
        page.html(this.jobListView.el).prepend(pages.career);

        this.$crumbs = $('#crumbs');
        this.pageWidth = page.outerWidth();

        utils.debug.log('career view rendered');
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

      isFieldEmpty: function($target){
        return !$target.val();
      },

      isAnyEmpty: function(){
        var errors = 0;
        $('input').each(function(index, field){
          if(!$(field).val()){
            errors++;
          }
        });

        return !!errors;
      },

      validateField: function($target){
        if(this.isFieldEmpty($target)){
          var msg = 'Не заполнили';
          this.showErrorTooltip($target, msg);
          return false;
        }

        if($target.attr('id') === 'phone-field'){
          var phoneRegexp = /^\+?[0-9]{1,3}[-. (]?\(?([0-9]{3})\)?[)-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/;
          if(!phoneRegexp.test($target.val())){
            this.showErrorTooltip($target);
            return false;
          }
        }

        if($target.attr('id') === 'email-field'){
          var emailRegexp = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/;
          if(!emailRegexp.test($target.val())){
            this.showErrorTooltip($target);
            return false;
          }
        }

        if(!this.isFieldEmpty($target)){
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

      _showAlert: function(){
        var $form = $('#contact-form');

        var $alert = $form.find('#alert');
        $alert.fadeIn(config.fadeTime);

        setTimeout(function(){
          $alert.fadeOut(config.fadeTime);
        }, 7000);

        var $fields = $('input');
        var $submitBtn = $('#submit');

        $submitBtn.hide();
        $fields.each(function(index, field){
          $(field).val('');
        });
        $('textarea').val('');
      },

      showJobs: function(id){
        id = parseInt(id, 10);
        if(isNaN(id)){
          utils.debug.error('bad id');

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

        $('#content-container').addClass('content__fullsize');

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

        this._movePages(1);
        setTimeout(function(){
          $('#page-3').remove();
        }, config.animationTime)

        var urn = '#career/type=' + id;

        var readyCrumb = _.find($('.crumb a'), function(item){
          return $(item).attr('href') === urn;
        });

        if(!readyCrumb){
          this.removeCrumbs(this.$crumbs.children().first());
          this.addCrumb(urn, category.name);
        }
        this.removeCrumbs(this.$crumbs.children().first().next());

        $('.career-table tbody tr').on('click', function(){
          window.location = $(this).find('a').attr('href');
        });

        utils.debug.log('jobs page generated');
      },

      showJob: function(id){
        id = parseInt(id, 10);
        if(isNaN(id)){
          utils.debug.error('bad id');
          return;
        }

        // collect page data
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

        // check exist pages container
        var $pages = $('#pages');
        if(!$pages[0]){
          this.render(false);
          this.showJobs(category.id);
          this.showJob(id);
          $('#pages').addClass('pages__transition');
          return;
        }

        // page preparation
        if(!$('page-3')[0]){
          this.jobView.render(data);
          this.$('#page-2').after(this.jobView.el);
        }

        // page transition
        this._movePages(2);

        // add bredcrumb
        var urn = '#career/job=' + id;

        var readyCrumb = _.find($('.crumb a'), function(item){
          return $(item).attr('href') === urn;
        });

        if(!readyCrumb){
          this.addCrumb(urn, job.name);
        }
        this.removeCrumbs(this.$crumbs.children().first().next().next());

        // remove height restriction
        $('#content-container').addClass('content__fullsize');

        utils.debug.log('job page generated');

        // custom file input
        $('#file-input').on('click', function(e){
          e.preventDefault();
          if(e.currentTarget === this && e.target.nodeName !== 'INPUT') {
            $(this.control).click();
          }
        });

        $('#resume-field').on('change', function(){
          $('#brows-field').val($('#resume-field')[0].files[0].name);
        });

        // form validation
        var self = this;
        var $fields = $('input');
        var $submitBtn = $('#submit');
        $fields.on('focusout keyup change', function(e){
          var $target = $(this);

          if(e.type === 'keyup' && e.keyCode === 9){
            return;
          }

          if(self.isFieldEmpty($target)){
            var msg = 'Не заполнили';
            self.showErrorTooltip($target, msg);
          }
          else {
            self.removeErrorTooltip($target);
          }

          if(!self.isAnyEmpty()){
            $submitBtn.attr('disabled', false);
          }
        });

        // form submit
        var $form = $('#contact-form');
        if(!$form.get(0)){
          utils.debug.error('no contact form');
          return;
        }

        if(!FormData){
          $form.attr('target', 'upload-target');
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', config.mailUrl, false);

        $submitBtn.on('click', function(e){
          if(self.validateAll()){
            if(FormData){
              e.preventDefault();

              var fd = new FormData($form.get(0));

              $fields.each(function(index, field){
                var $field = $(field);
                fd.append($field.attr('name'), $field.val());
              });

              xhr.send(fd);
            }

            self._showAlert();
          }
          else{
            e.preventDefault();
            $submitBtn.attr('disabled', true);
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

        $('#contact-form').attr('action', config.mailUrl);

        utils.debug.log('form handlers initialized');
      }
    });

    return CareerView;
  });
