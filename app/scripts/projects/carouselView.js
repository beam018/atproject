define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var CarouselView = Backbone.View.extend({
    tagName: 'div',
    className: 'at-carousel',
    $content: $('#content'),
    id: 'at-carousel',
    template: $('#slider-template'),
    projectsUrl: '#projects/',

    initialize: function(collection){
      this.collection = collection;
      this.data = collection.toJSON();

      this.rendered = false;
    },

    render: function(){
      if(!this.collection){
        console.error('data don\'t passed');
        return;
      }

      if(!this.collection.length){
        this.$el.html('');
        return;
      }
      var id = this.collection.first().id;

      if(!this.rendered){
        var templateSource = this.template.html();
        var template = handlebars.compile(templateSource);

        var self = this;

        var context = {
          leftId: self.navLeft(id),

          rightId: self.navRight(id)
        };

        var html = template(context);

        this.$el.html(html);

        this.rendered = true;

        this.layer = this.$el.find('#at-layer');
        this.arrows = this.$el.find('a.arrow');
      }

      this.slideTo(id);
    },

    slideTo: function(id){
      this.changeSlide(id);
      this.updateArrows(id);
      this.setNav(id);
    },

    changeSlide: function(id){
      this.layer.hide();

      var slideData = this.collection.get(id).attributes;

      this.layer.css(
        'background-image',
        'url(/media/' + slideData.image + ')'
      );
      
      var self = this;
      this.layer.fadeIn(500, function(){
        self.$el.css(
          'background-image',
          'url(/media/' + slideData.image + ')'
        );
      });
    },

    setNav: function(id){
      id = parseInt(id, 10);
      if (isNaN(id)){
        console.error('id must be number');
        return;
      }

      this.$content
        .find('#project-' + id)
        .addClass('active-project')
        .siblings('.active-project')
        .removeClass('active-project');
    },

    renderCurent: function(id){
      id = parseInt(id, 10);
      if (isNaN(id)){
        console.error('id must be number');
        return;
      }

      if(!_.find(this.collection.toJSON(), function(item){
        return item.id === id;
      })){
        console.warn('id ' + id + ' not found');
        id = this.collection.first().id;
      }

      this.slideTo(id);
    },

    navLeft: function(id){
      if(typeof id === 'undefined'){
        console.error('id don\'t passed');
        return;
      }

      var newId = 0;

      if(id <= this.collection.first().id){
        newId = this.collection.last().id;
      }
      else {
        newId = --id;
      }

      this.$el.find('a.left').attr('href', this.projectsUrl + newId);

      return newId;
    },

    navRight: function(id){
      if(typeof id === 'undefined'){
        console.error('id don\'t passed');
        return;
      }

      var newId = 0;

      if(id >= this.collection.last().id){
        newId = this.collection.first().id;
      }
      else {
        newId = ++id;
      }

      this.$el.find('a.right').attr('href', this.projectsUrl + newId);

      return newId;
    },

    updateArrows: function(id){
      this.navLeft(id);
      this.navRight(id);
    }
  });

  return CarouselView;
});