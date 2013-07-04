define(['jquery', 'underscore', 'backbone', 'utils',
	'pages/collections/pages'], function($, _, Backbone, utils, Pages){
	'use strict';

	var PagesView = Backbone.View.extend({
		el: $('#content'),

		initialize: function(pages){
			var _pages = pages;
			this.pages = [];

			for(var key in _pages){
				if(!_pages[key]) continue;
				this.pages[key] = new Pages(_pages[key]);
			}

			this.containerTemplate = _.template($('#page-thumb-template').html());

			utils.debug.log('pages view initialized');
		},

		render: function(key, id){
			this.container = $('<div class="grid-row slider-row"></div>');

			var _key = key;
			if(!_key) _key = 'home';

			var themePages = this.pages[_key];

			if(themePages === undefined){
				utils.debug.warn('no page data type');
				this.$el.html('');
				return;
			}

			var wrapPage = function(page){
	      return '<div class="career-content">' + page + '</div>';
	    };

			var html = '';

			if(themePages.length > 1){
				var _id = id;
				if(isNaN(parseInt(_id, 10))){
          _id = themePages.at(0).id;
        }
        var currentPage = themePages.get(_id);

        html = wrapPage(currentPage.toJSON().content);

				for(var pageKey in themePages.toJSON()){
					var thumbLink = this.containerTemplate(themePages.toJSON()[pageKey]);
					// jquery throw an error if template has tabs
					var $thumbLink = $(thumbLink.replace(/\s{2,}/g, ''));
					$thumbLink.addClass(
						themePages.length <= 3 ? 'grid3' : 'grid6'
					);
					this.container.append($thumbLink);
				}

				if(!this.$el.hasClass('slide')){
          this.$el.removeClass('single').addClass('slide');
          this.$el.parents('#content-container').append(this.container);
        }

        var id = currentPage.id;
        $('#page-thumb-' + _id)
          .addClass('active')
          .siblings()
          .removeClass('active');
			}
			else if(themePages.length === 1){
				html = wrapPage(this.pages[_key].at(0).toJSON().content);
			}
			else{
				utils.debug.warn('no page data');
				html = '';
			}

			this.$el.html(html);

			utils.debug.log('pages view rendered');
		}
	})

	return PagesView;
});