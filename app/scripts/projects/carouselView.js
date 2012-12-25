define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var CarouselView = Backbone.View.extend({
    tagName: 'ul',
    className: 'at-carousel',
    id: 'at-carousel',
    template: $('#slider-template'),

    events: {
      'click #at-carousel li': 'navTo',
      'click #at-carousel span.left': 'navLeft',
      'click #at-carousel span.right': 'navRight'
    },

    initialize: function(collection){
      this.collection = collection;

      this.rendered = false;
    },

    render: function(){
      if(!this.collection){
        console.error('data don\'t passed');
      }

      if(!this.rendered){
        var templateSource = this.template.html();
        var template = handlebars.compile(templateSource);
        var html = template({model: this.collection});

        this.$el.html(html);

        this.rendered = true;

        this.layer = this.$el.find('#at-layer');
        this.bar = this.$el.find('#at-bar');
        this.arrows = this.$el.find('span.arrow');
      }

      var slide = this.$el.find('li').first();
      this.slideTo(slide);
    },

    changeSlide: function(slide){
      this.layer.hide();
      this.bar.hide();
      this.arrows.hide();

      this.layer.css(
        'background-image',
        'url(' + slide.data('image') + ')'
      );
      
      var self = this;
      this.layer.fadeIn(500, function(){
        self.$el.css(
          'background-image',
          'url(' + slide.data('image') + ')'
        );

        self.bar.show();
        self.arrows.show();
      });
    },

    setNav: function(item){
      item
          .addClass('active')
          .siblings('li.active')
          .removeClass('active');
    },

    slideTo: function(slide){
      this.changeSlide(slide);
      this.setNav(slide);
    },

    renderCurent: function(id){
      var slide = this.$el.find('#project-' + id);
      this.slideTo(slide);
    },

    navTo: function(e){
      this.slideTo($(e.target));
    },

    navLeft: function(){
      var item = this.$el
        .find('li.active')
        .prev('li')
        .first();

      if(!item.data('image')){
        item = this.$el.find('li').last();
      }

      this.slideTo(item);
    },

    navRight: function(){
      var item = this.$el
        .find('li.active')
        .next('li')
        .first();

      if(!item.data('image')){
        item = this.$el.find('li').first();
      }

      this.slideTo(item);
    }
  });

  return CarouselView;
});