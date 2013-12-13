define(['backbone', 'pages/models/page'], function(Backbone, Page){
  'use strict';

  var Pages = Backbone.Collection.extend({
    model: Page,

    getElement: function() {
      return this.currentElement;
    },

    setElement: function(model) {
      this.currentElement = model;
    },

    getNext: function(){
      var elem = this.at(this.indexOf(this.getElement()) + 1);
      if(!elem){elem = this.first();}

      return elem;
    },

    next: function (){
      this.setElement(this.getNext());

      return this;
    },

    getPrev: function(){
      var elem = this.at(this.indexOf(this.getElement()) - 1);
      if(!elem){elem = this.last();}

      return elem;
    },

    prev: function() {
      this.setElement(this.getPrev());
      return this;
    }
  });

  return Pages;
});