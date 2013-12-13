define(['jquery', 'config'], function($, config){
	'use strict';

	return {
		$crumbs: $('#crumbs'),

		addCrumb: function(link, name, fadeTime){
      this.$crumbs = $('#crumbs');

      if(fadeTime === undefined){
        fadeTime = 300;
      }
      var tmpl = _.template($('#crumb-template').html());
      var content = tmpl({
        name: name,
        link: link
      });
      this.$crumbs.append(content).children('.crumb').fadeIn(fadeTime);
      this.activateLastCrumb();
    },

    removeCrumbs: function($crumb, fadeTime){
      this.$crumbs = $('#crumbs');

      var self = this;
      $crumb.nextAll().each(function(index, item){
        $(item).fadeOut(config.fadeTime, function(){
          $(this).remove();
          self.activateLastCrumb();
        });
      });
    },

    activateLastCrumb: function(){
      this.$crumbs
        .children()
        .last()
        .addClass('active')
        .siblings()
        .removeClass('active');
    }
	};
});