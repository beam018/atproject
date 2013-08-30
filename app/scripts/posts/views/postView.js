define(['backbone', 'jquery', 'underscore', 
	'utils', 'posts/collections/posts'], function(Backbone, $, _, utils, Posts){
	'use strict';

	var resources = utils.resources;

	var PostView = Backbone.View.extend({
		el: $('#content'),
		template: $('#posts-template').html(),

		render: function(){
			$('#content').addClass('content__fullsize');

			var data = new Posts(resources.posts).toJSON();
			var tmpl = _.template(this.template);
			var postListHtml = tmpl({data: data});

			this.$el.html('<div class="career-content">' +
				resources.postsText + 
				postListHtml +
				'</div>');

			this.$el.find('.posts td').each(function(){
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