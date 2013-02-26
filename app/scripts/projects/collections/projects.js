define(['backbone', 'projects/models/project'], function(Backbone, Project){
  'use strict';

  var Projects = Backbone.Collection.extend({
    model: Project,

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

  return Projects;
});