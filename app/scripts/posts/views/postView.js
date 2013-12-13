define(['backbone', 'jquery', 'underscore', 
	'utils', 'posts/collections/posts'], function(Backbone, $, _, utils, Posts){
	'use strict';

	var resources = utils.resources;

	var PostView = Backbone.View.extend({
		el: $('#content'),
		template: $('#posts-template').html(),

		render: function(){
			$('#content-container').addClass('content__fullsize');

			var data = new Posts(resources.posts).toJSON();

			var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 
				'авг', 'сен', 'окт', 'ноя', 'дек'];

			for (var i = 0; i < data.length; i++) {
				if(!data[i].pub_date){
					continue;
				}

				var splitedDate = data[i].pub_date.split('.');

				if(splitedDate[2] == new Date().getFullYear()){
					data[i].pub_date = splitedDate[0] +
						' ' + months[parseInt(splitedDate[1], 10) - 1];
				}
			};

			var postListHtml = '';

			if(data[0]){
				var tmpl = _.template(this.template);
				postListHtml = tmpl({data: data});
			}

			this.$el.html('<div class="career-content">' +
				resources.postsText + 
				postListHtml +
				'</div>');

			this.$el.find('.posts tr').each(function(){
				var $this = $(this);
				$this.click(function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.open($this.find('a').attr('href'), '_blank');
       	});
			});
		}
	});

	return PostView;
});