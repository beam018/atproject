define(['backbone'], function(Backbone){
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
      var tmpl = _.template(this.template);
      console.log(this.$el);
      this.$el.html(tmpl(data));

      var forward = $('#slider-forward-layer', this.$el);
      var back = $('#slider-back-layer', this.$el);

      var self = this;

      forward.css(
        'background',
        'url(/media/' + self.collection.getElement().toJSON().image + ') no-repeat 50% 50%'
        // 'red'
      );
/*
      forward.fadeIn(3000, function(){
        back.css(
          'background',
          // 'url(/media/' + self.collection.getElement().toJSON().image + ') no-repeat 50% 50%'
          'blue'
        );
      });*/
    }
  });

  return CarouselView;
});