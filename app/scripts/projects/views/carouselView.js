define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
  'use strict';

  var CarouselView = Backbone.View.extend({
    el: $('#content'),
    template: $('#slider-template').html(),

    render: function(id){
      if(id){
        this.collection.setElement(this.collection.get(id));
      }
      else{
        this.collection.setElement(this.collection.at(0));
      }

      var data = {
        project: this.collection.getElement().toJSON(),
        next: this.collection.getNext().toJSON(),
        prev: this.collection.getPrev().toJSON()
      };

      if(!$('#slider-back-layer')[0]){
        var tmpl = _.template(this.template);
        this.$el.html(tmpl(data));
      }
      else{
        var $leftArrow = $('#left-arrow');
        var $rightArrow = $('#right-arrow');

        $leftArrow.attr('href', '#projects/' + data.prev.id);
        $rightArrow.attr('href', '#projects/' + data.next.id);

        var $content = $('#slider-content');

        $content.html(data.project.content);
      }

      var forward = $('#slider-forward-layer', this.$el);
      var back = $('#slider-back-layer', this.$el);

      forward.hide();
      forward.css(
        'background',
        'url(/media/' + data.project.image + ') no-repeat 50% 50%'
      );

      forward.fadeIn(150, function(){
        back.css(
          'background',
          'url(/media/' + data.project.image + ') no-repeat 50% 50%'
        );
      });
    }
  });

  return CarouselView;
});