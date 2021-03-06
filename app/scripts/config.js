define([], function(){
  'use strict';

  var config = {};

  // config.serverUrl = 'http://127.0.0.1:8000/';
  config.serverUrl = 'http://api.allodsteam.ru/';

  config.apiUrl = config.serverUrl + 'v1/';
  config.staticUrl = config.serverUrl + 'static/';
  config.mediaUrl = config.serverUrl + 'media/';
  config.mailUrl = config.serverUrl + 'mail/';
  // config.pagesUrl = config.apiUrl + 'pages/';

  config.notFoundUrl = '404';

  // config.debug = true;
  config.debug = false;

  config.fadeTime = 400;
  config.animationTime = 300;

  config.social = false;

  return config;
});
