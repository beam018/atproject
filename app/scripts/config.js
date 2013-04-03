define([], function(){
  'use strict';

  var config = {
    // serverUrl: 'http://127.0.0.1:8000/'
    serverUrl: 'http://api.allodsteam.ru/'
  };

  config.mediaUrl = config.serverUrl + 'media/';

  config.fadeTime = 150;

  return config;
});
