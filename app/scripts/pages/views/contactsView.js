define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'config',
    'pages/collections/pages',
    'pages/views/crumbView'
  ], function(
      $,
      _,
      Backbone,
      utils,
      config,
      Pages,
      CrumbView
  ){
    'use strict';

    var resources = utils.resources,
        pages = resources.pages;

    var CareerView = Backbone.View.extend({
      el: $('#content'),
      template: $('#contacts-template').html(),

      initialize: function(collection){
        this.collection = new Pages(collection);
        
        utils.debug.log('contacts view initialized');
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

      addCrumb: CrumbView.addCrumb,
      removeCrumbs: CrumbView.removeCrumbs,
      activateLastCrumb: CrumbView.activateLastCrumb,

      render: function(smooth){
        if(smooth !== false){
          smooth = true;
        }

        var $page1 = $('#contacts-1');
        this.$crumbs = $('#crumbs');

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
        var page = this.$el.find('#contacts-1');

        if(this.collection.length){
          var contactsListElem = $('<div class="career-category"></div>');
          var thumbsTmpl = _.template($('#contacts-thumb-template').html());
          for(var i=0; i<this.collection.length; i++){
            var thumbHtml = thumbsTmpl(this.collection.toJSON()[i]);
            contactsListElem.append(thumbHtml);
          }
        }

        page.html(contactsListElem).prepend(resources.contactsText || '<p></p>');

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

        var $pages = $('#pages');
        if(!$pages[0]){
          this.render(false);
          this.showContact(id);
          $('#pages').addClass('pages__transition');
          return;
        }

        var contact = this.collection.get(id).toJSON();
        if($('#contacts-2')[0]){
          var page2 = $('#contacts-2');
        }
        else{
          var page2 = $('<div class="career-content content-page" id="contacts-2"></div>');
        }
        page2.html(contact.content);
        if(contact.image){
          page2.css(
            'background-image',
            'url(' + config.mediaUrl + contact.image + ')'
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
        if($('#page-3')[0]){
          // TODO: refact
          this.removeCrumbs(this.$crumbs.children().first().next());
        }

        utils.debug.log('contact page generated');
      }
    });

    return CareerView;
  });
