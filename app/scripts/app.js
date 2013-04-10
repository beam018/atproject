define([
  'utils',
  'router'
], function(utils, Router){
  'use strict';

  var initialize = function(){
    Router.initialize();
  };

  return {
    initialize: initialize
  };
});