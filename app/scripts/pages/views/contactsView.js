define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'config',
    'pages/collections/pages',
    'pages/views/crumbView',
    'career/collections/jobsList',
    'career/views/jobView'
  ], function(
      $,
      _,
      Backbone,
      utils,
      config,
      Pages,
      CrumbView,
      JobsList,
      JobView
  ){
    'use strict';

    var r = utils.resources,
        pages = r.pages;

    var CareerView = Backbone.View.extend({
      el: $('#content'),
      template: $('#contacts-template').html(),
      jobsCollection: new JobsList(r.jobs),
      jobsListTemplate: _.template($('#contacts-jobs-list-template').html()),
      jobView: new JobView(),

      initialize: function(collection){
        this.collection = new Pages(collection);

        utils.debug.log('contacts view initialized');
      },

      _movePages: function(pos){
        var $pages = $('#contacts-pages');

        $pages.attr(
          'class',
          $pages
            .attr('class')
            .replace(/pages__translate-\d+/g, 'pages__translate-' + pos)
        );
      },

      addCrumb: CrumbView.addCrumb,
      removeCrumbs: CrumbView.removeCrumbs,
      activateLastCrumb: CrumbView.activateLastCrumb,

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

      render: function(smooth){
        if(smooth !== false){
          smooth = true;
        }

        var $page1 = $('#contacts-1');
        this.$crumbs = $('#crumbs');

        this.$el.addClass('rounded__crumbs');

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
        var page = this.$el.find('#contacts-1');

        if(this.collection.length){
          var contactsListElem = $('<div class="career-category contacts-category"></div>');
          var thumbsTmpl = _.template($('#contacts-thumb-template').html());
          for(var i=0; i<this.collection.length; i++){
            var thumbHtml = thumbsTmpl(this.collection.toJSON()[i]);
            contactsListElem.append(thumbHtml);
          }
        }

        page.html(contactsListElem).prepend(r.contactsText || '<p></p>');

        this.$crumbs = $('#crumbs');
        this.pageWidth = page.outerWidth();

        utils.debug.log('contacts view rendered');
      },

      showContact: function(id, saveNextPage){
        id = parseInt(id, 10);
        if(isNaN(id)){
          utils.debug.error('bad id');

          this.$el.html('');
          return;
        }

        if(!this._$pages().length){
          this.render();
          this.showContact(id);
          $('#contacts-pages').addClass('pages__transition');
          return;
        }

        var contact = this.collection.get(id).toJSON();
        if($('#contacts-2').length){
          var page2 = $('#contacts-2');
        }
        else{
          var page2 = $('<div class="career-content content-page" id="contacts-2"></div>');
        }
        page2.html(contact.content);
        if(contact.image){
          page2.css(
            'background-image',
            'url(/media/' + contact.image + ')'
          );
        }
        this.$('#contacts-1').after(page2);

        this._movePages(1);

        var urn = '#contacts/' + id;

        var readyCrumb = _.find($('.crumb a'), function(item){
          return $(item).attr('href') === urn;
        });

        // TODO: refact
        // if crumbs children length == 2
        // then change crumb value and url
        if(!readyCrumb){
          this.removeCrumbs(this.$crumbs.children().first());
          this.addCrumb(urn, contact.caption);
        }
        if($('#contacts-3')[0]){
          // TODO: refact
          this.removeCrumbs(this.$crumbs.children().first().next());
          $('#contacts-3').remove();
        }

        utils.debug.log('contact page generated');
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
        var jobs = _.map(r.jobs, function(item) {

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
      _renderJobsByQuery: function(queryStr, contactId, wrapped) {

        var queryStr = queryStr || '',
          jobs = this._getJobsByQuery(
            this._parseQuery(queryStr)
          ),
          tmpl = this.jobsListTemplate({
            jobs: jobs,
            contactId: contactId
          }),
          wrapped = wrapped || wrapped === undefined,
          $page = $('contacts-3'),
          page = $page.length
            ? $page
            : $('<div id="contacts-3" class="career-content"></div>');

        return wrapped
          ? page.html(tmpl)
          : tmpl;

      },

      /**
       * @returns {HTMLElement}
       * @private
       */
      _$pages: function() {

        this.$pages && this.$pages.length || ( this.$pages = $('#contacts-pages') );

        return this.$pages

      },

      /**
       * Draw jobs page by params
       *
       * @param {String} query Query String
       * @param {Number} contactId
       * @param {String} [label] Text in crumb
       * @returns {CareerView} this
       */
      showJobsByQuery: function(queryStr, contactId, label) {

        var $page = $('#contacts-3'),
            urn = '#contacts/' + contactId + '/jobs';

        label || ( label = 'Query page' );

        $('#content-container').addClass('content__fullsize');

        if (!this._$pages().length) {
          this.render()
          this.showContact(contactId);
        };

        if (!$page.length) {

          this._$pages().append(this._renderJobsByQuery(queryStr, contactId));

        }
        else {

          $page.html(this._renderJobsByQuery(queryStr, contactId, false));

        }

        this._movePages(2);

        // TODO: refact crumb API!!!!! D:

        if (!_.find($('.crumbs a'), function (item) {

            return $(item).attr('href') === urn;

          })) {

          this.addCrumb(urn, label);

        }

        this.removeCrumbs(this.$crumbs.children().first().next().next());
        // --

        $page.nextAll().remove();

        utils.debug.log('Query page rendered.');

        return this;

      },

      /**
       * Render table with jobs, filtered by city
       *
       * @param {Number} id City id
       * @returns {ContacsView}
       */
      jobsByCity: function(id) {

        var city = this.collection.get(id).toJSON().caption;

        this.showJobsByQuery('filter=1&city=' + city, id, 'Вакансии');

        return this;

      },

      showJob: function(id, contactId){
        id = parseInt(id, 10);
        if(isNaN(id)){
          utils.debug.error('bad id');
          return;
        }

        if(!this._$pages().length){
          this.render(false);
          this.showContact(contactId);
          this.jobsByCity(contactId);
          this.showJob(id, contactId);
          $('#contacts-pages').addClass('pages__transition');
          return;
        }

        var job = this.jobsCollection.get(id).toJSON();
        var category = job.category;

        document.title = job.name + ' | ' + job.project + ' | ' + job.city + ' - ' + $( 'title' ).html();

        var data = {
          job: job,
          category: category,
          social: config.social
        };

        if(!$('page-3')[0]){
          this.jobView.render(data);
          this.$('#contacts-3').after(this.jobView.el);
        }

        this._movePages(3);

        var urn = '#contacts/' + contactId + '/jobs/' + id;

        var readyCrumb = _.find($('.crumb a'), function(item){
          return $(item).attr('href') === urn;
        });
        console.log(readyCrumb);

        this.removeCrumbs(this.$crumbs.children().first().next().next().next());
        if(!readyCrumb){
          this.addCrumb(urn, job.name);
        }

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

        $('#contact-form').attr('action', config.mailUrl);

        utils.debug.log('form handlers initialized');
      }
    });

    return CareerView;
  });
