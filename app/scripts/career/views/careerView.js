define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'config',
    'career/collections/jobsList',
    'career/collections/jobCategories',
    'career/views/jobsListView',
    'career/views/jobsView',
    'career/views/jobView',
    'pages/views/crumbView'
  ], function(
      $,
      _,
      Backbone,
      utils,
      config,
      JobsList,
      JobCategories,
      JobsListView,
      JobsView,
      JobView,
      CrumbView
  ){
    'use strict';

    var r = utils.resources,
        pages = r.pages;

    var CareerView = Backbone.View.extend({
      el: $('#content'),
      contentBaseHtml: _.template($('#career-template').html()).call(null),
      jobsListTemplate: _.template($('#jobs-list-template').html()),
      jobsCollection: new JobsList(r.jobs),
      jobCategoriesCollection: new JobCategories(r.jobCategories),
      jobsView: new JobsView(),
      jobView: new JobView(),

      addCrumb: CrumbView.addCrumb,
      removeCrumbs: CrumbView.removeCrumbs,
      activateLastCrumb: CrumbView.activateLastCrumb,
      removeAllCrumbs: CrumbView.removeAll,

      _movePages: function(pos){
        var $pages = $('#pages');

        $pages.attr(
          'class',
          $pages
            .attr('class')
            .replace(/pages__translate-\d+/g, 'pages__translate-' + pos)
        );
      },

      _showErrorTooltip: function($target, msg){
        var $fieldContainer = $target.parent('div');

        var tooltipErrorTmplSrc = $('#tooltip-error-template').html();
        var tooltipErrorTmpl = _.template(tooltipErrorTmplSrc);

        var targetId = $target.attr('id');
        if(!msg && (targetId === 'phone-field' || targetId === 'email-field' || targetId === 'attachment-link-field' || targetId === 'test-field')){
          var name = $fieldContainer.find('label').html();
          msg = 'Неверно заполнили поле "' + name.replace(':', '') + '"';
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

      _removeErrorTooltip: function($target){
        $target.parent('div')
          .find('.tooltip')
          .fadeOut(config.fadeTime, function(){
            $(this).remove();
          });
        $target.removeClass('error');
      },

      _isFieldEmpty: function($target){
        return !$target.val();
      },

      _isAnyEmpty: function(){
        var errors = 0;
        $('input').each(function(index, field){
          if(!$(field).val()){
            errors++;
          }
        });

        return !!errors;
      },

      _validateField: function($target){
        $target.removeClass('valid');

        if(this._isFieldEmpty($target)){
          var msg = 'Не заполнили';
          this._showErrorTooltip($target, msg);
          return false;
        }

        if($target.attr('id') === 'phone-field'){
          var phoneRegexp = /^\+?[0-9]{1,3}[-. (]?\(?([0-9]{3})\)?[)-. ]?([0-9]{3})[-. ]?([0-9]{2,3})[-. ]?([0-9]{0,2})$/;
          if(!phoneRegexp.test($target.val())){
            this._showErrorTooltip($target);
            return false;
          }
        }

        if($target.attr('id') === 'email-field'){
          // var emailRegexp = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/;
          var emailRegexp = /[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
          if(!emailRegexp.test($target.val())){
            this._showErrorTooltip($target);
            return false;
          }
        }

        if($target.attr('id') === 'attachment-link-field'){
          var attachmentLinkRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          if(!attachmentLinkRegexp.test($target.val())){
            this._showErrorTooltip($target);
            return false;
          }
        }

        if($target.attr('id') === 'test-field'){
          var linkRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          if(!linkRegexp.test($target.val())){
            this._showErrorTooltip($target);
            return false;
          }
        }

        if(!this._isFieldEmpty($target)){
          this._removeErrorTooltip($target);
        }

        $target.addClass('valid');
        return true;
      },

      _validateAll: function(){
        var $fields = $('input');
        var errors = false;

        for(var i=0; i<$fields.length; i++){
          if(!this._validateField($($fields[i]))){
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

      /**
       * Parse params from query string
       *
       * @param {String} queryStr
       * @returns {Object}
       * @private
       */
      _parseQuery: function(queryStr) {

        return _.reduce(queryStr.split('&'), function(memo, iter) {

            var f = iter.split('=');

            memo[f[0]] = _.isNaN(+f[1]) ? f[1] : +f[1];

            return memo;

        }, {});

      },

      /**
       * Filter jobs by query
       *
       * @param {Object} query Objects of query params
       * @returns {Array}
       * @private
       */
      _getJobsByQuery: function(query) {

        // TODO: refact
        var jobs = _.map(this.jobsCollection.toJSON(), function(item) {

          var key;

          for (key in item.category)
            item['category__' + key] = item.category[key];

          return item;

        });

        if (!!query.filter) {

          delete query.filter;

          return _.where(jobs, query);

        }

        return jobs;

      },

      /**
       * Generate content of the page (without breadcrumbs)
       *
       * @param {String} queryStr
       * @param {Boolean} [wrapped]
       * @returns {String} HTML content of the page
       * @private
       */
      _renderJobsByQuery: function(queryStr, wrapped) {

        var queryStr = queryStr || '',
          jobs = this._getJobsByQuery(
            this._parseQuery(queryStr)
          ),
          tmpl = this.jobsListTemplate({ jobs: jobs }),
          wrapped = wrapped || wrapped === undefined,
          $page = $('#page-2'),
          page = $page.length
            ? $page
            : $('<div id="page-2" class="career-content"></div>');

        return wrapped
          ? page.html(tmpl)
          : tmpl;

      },

      /**
       * @returns {HTMLElement}
       * @private
       */
      _$pages: function() {

        this.$pages && this.$pages.length || ( this.$pages = $('#pages') );

        return this.$pages

      },

      /**
       * @returns {CareerView}
       */
      initialize: function() {

        this.jobListView = new JobsListView({

          collection: this.jobCategoriesCollection

        });

        this.categoryThumbsHtml = this.jobListView.el.outerHTML;

        utils.debug.log('career view initialized');

        return this;

      },

      /**
       * Render main page of view
       *
       * @returns {CareerView}
       */
      render: function(){

        var $page = this.$el.find('#page-1');

        if (!$page.length) {

          this.$el
            .addClass('rounded__crumbs')
            .html(this.contentBaseHtml);

          this.$crumbs = $('#crumbs');

          $page = this.$el.find('#page-1');

          $page.html(r.career + this.categoryThumbsHtml);

        }
        else {

          this._movePages(0);

          this.removeCrumbs(this.$crumbs.children().first());

        }

        utils.debug.log('career view rendered');

        return this;

      },

      /**
       * Draw jobs page by params
       *
       * @param query Query String
       * @param [label] Text in crumb
       * @returns {CareerView} this
       */
      showJobsByQuery: function(queryStr, label) {

        var $page = $('#page-2'),
            urn = window.location.hash;

        label || ( label = 'Query page' );

        $('#content-container').addClass('content__fullsize');

        !this._$pages().length && this.render();

        if (!$page.length) {

          this._$pages().append(this._renderJobsByQuery(queryStr));

        }
        else {

          $page.html(this._renderJobsByQuery(queryStr, false));

        }

        // TODO: refact crumb API!!!!! D:
        if (!_.find($('.crumbs a'), function (item) {

            return $(item).attr('href') === urn;

          })) {

          this.addCrumb(urn, label);

        }

        this.removeCrumbs(this.$crumbs.children().first().next());
        // --

        $page.nextAll().remove();

        this._movePages(1);

        utils.debug.log('Query page rendered.');

        return this;

      },

      /**
       * Render table with jobs, filtered by city
       *
       * @param city City name
       * @returns {CareerView}
       */
      jobsByCity: function(city) {

        this.showJobsByQuery('filter=1&city=' + city, 'Вакансии: ' + city);

        return this;

      },

      showJobs: function(id, saveNextPage){
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

        var query = this._parseQuery('filter=1&category__id=' + id);
        var jobs = this._getJobsByQuery(query);

        var category = this.jobCategoriesCollection.get(id).toJSON();

        var data = {
          jobs: jobs,
          category: category
        };

        this.jobsView.render(data);
        if(data.category.background){
          this.jobsView.$el.css(
            'background-image',
            'url(' + config.mediaUrl + data.category.background + ')'
          );
        }
        this.$('#page-1').after(this.jobsView.el);

        this._movePages(1);
        setTimeout(function(){
          // bug

          if(!saveNextPage){
            $('#page-3').remove();
          }
        }, config.animationTime)

        var urn = '#career/type=' + id;

        var readyCrumb = _.find($('.crumb a'), function(item){
          return $(item).attr('href') === urn;
        });

        // TODO: refact
        // if crumbs cildren length == 2
        // then change crumb value and url
        if(!readyCrumb){
          this.removeCrumbs(this.$crumbs.children().first());
          this.addCrumb(urn, category.name);
        }
        if($('#page-3')[0]){
          // TODO: refact
          this.removeCrumbs(this.$crumbs.children().first().next());
        }

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
        var category = job.category;

        document.title = job.name + ' | ' + job.project + ' | ' + job.city + ' - ' + $( 'title' ).html();

        var data = {
          job: job,
          category: category,
          social: config.social
        };

        // check exist pages container
        var $pages = $('#pages');
        if(!$pages[0]){
          this.render(false);
          this.showJobs(category.id, true);
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

          if(!self._validateField($target)){
            self._showErrorTooltip($target);
          }
          else {
            self._removeErrorTooltip($target);
          }

          if(!self._isAnyEmpty()){
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

        $submitBtn.on('click', function(e){
          if(self._validateAll()){
            if(FormData){
              e.preventDefault();

              var xhr = new XMLHttpRequest();
              xhr.open('POST', config.mailUrl, false);

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
