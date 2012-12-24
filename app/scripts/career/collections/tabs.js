define(['backbone', 'career/models/tab'], function(Backbone, Tab){
  'use strict';

  var Tabs = Backbone.Collection.extend({
    model: Tab
  });

  return Tabs;
});