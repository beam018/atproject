define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var CarouselView = Backbone.View.extend({
    tagName: 'ul',
    className: 'at-carousel',
    id: 'at-carousel',
    template: $('#slider-template'),
    render: function(data){
      var html = '';

      if(data){
        var templateSource = this.template.html();
        var template = handlebars.compile(templateSource);
        html = template(data);
      }

      this.$el.html(html);
      var first = this.$el.find('li').first();

      first.addClass('active');
      this.$el.css('background-image', 'url(' + first.data('image') + ')');

      var self = this;
      this.$el.find('li').on('click', function(){
        var $this = $(this);

        $this.addClass('active').siblings('.active').removeClass('active');
        self.$el.css('background-image', 'url(' + $this.data('image') + ')');
      });

      this.$el.find('.left').on('click', function(){
        var item = self.$el
          .find('li.active')
          .prev('li')
          .first();

        if(!item.data('image')){
          item = self.$el.find('li').last();
        }

        item
          .addClass('active')
          .siblings('li.active')
          .removeClass('active');

        self.$el.css('background-image', 'url(' + item.data('image') + ')');
      });

      this.$el.find('.right').on('click', function(){
        var item = self.$el
          .find('li.active')
          .next('li')
          .first();

        if(!item.data('image')){
          item = self.$el.find('li').first();
        }

        item
          .addClass('active')
          .siblings('li.active')
          .removeClass('active');

        self.$el.css('background-image', 'url(' + item.data('image') + ')');
      });
    }
  });

  return CarouselView;
});