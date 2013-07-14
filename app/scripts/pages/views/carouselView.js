define(
  ['jquery', 'underscore', 
  'backbone', 'utils'], function($, _, Backbone, utils){
  'use strict';

  var CarouselView = Backbone.View.extend({
    el: $('#content'),
    template: $('#slider-template').html(),

    render: function(id, pageName){
      if(id){
        this.collection.setElement(this.collection.get(id));
      }
      else{
        this.collection.setElement(this.collection.at(0));
      }

      try{
        this.collection.getElement().toJSON();
      }
      catch(err){
        utils.debug.error(err.message);
        this.collection.setElement(this.collection.at(0));
        utils.debug.warn('active page changed to first exist');
      }

      if(!pageName){
        return;
      }
      var _pageName = pageName;

      var data = {
        project: this.collection.getElement().toJSON(),
        next: this.collection.getNext().toJSON(),
        prev: this.collection.getPrev().toJSON()
      };

      if(!$('#slider-back-layer')[0]){
        var tmpl = _.template(this.template);
        data.pageName = _pageName;
        this.$el.html(tmpl(data));
      }
      else{
        var $leftArrow = $('#left-arrow');
        var $rightArrow = $('#right-arrow');

        $leftArrow.attr('href', '#' + _pageName + '/' + data.prev.id);
        $rightArrow.attr('href', '#' + _pageName + '/' + data.next.id);

        var $content = $('#slider-content');

        $content.html(data.project.content);
      }

      if(_pageName === 'projects'){
        $('#slider-content')
          .removeClass('darkText')
          .addClass('lightText');
      }
      else {
        $('#slider-content')
          .removeClass('lightText')
          .addClass('darkText');
      }

      if(this.collection.length <= 1){
        $('#slider-control-layer').hide();
      }
      else{
        $('#slider-control-layer').show();
      }

      var forward = $('#slider-forward-layer', this.$el);
      var back = $('#slider-back-layer', this.$el);

      forward.hide();
      if(data.project.image){
        forward.css(
          'background',
          'url(/media/' + data.project.image + ') no-repeat 50% 50%'
        );
      }
      else{
        forward.css('background', '');  
      }

      forward.fadeIn(150, function(){
        if(data.project.image){
          back.css(
            'background',
            'url(/media/' + data.project.image + ') no-repeat 50% 50%'
          );
        }
        else{
          back.css('background', '');  
        }
      });
    }
  });

  return CarouselView;
});