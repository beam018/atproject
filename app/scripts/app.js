define([
  'utils',
  'router',
  'jquery'
], function(utils, Router, $){
  'use strict';

  var initialize = function(){
    Router.initialize();
    utils.debug.log('router initialised');
  };

  return {
    initialize: initialize
  };
});