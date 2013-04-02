define([
  'resources',
  'config',
  'backbone',
  'career/careerView',
  'projects/projectsView'
], function(resources, config, Backbone, CareerView, ProjectsView){
  'use strict';

  $(document).ready(function(){

    var dropdown = $('#dropdown');

    var tmpl = _.template($('#dropdown-item-template').html());
    var jobs = _.groupBy(resources.jobs, 'category');

    _.each(resources.jobCategories, function(item, index){
      var count = jobs[item.id] ? jobs[item.id].length : 0;

      dropdown.append(tmpl({
        item: item,
        index: index,
        count: count
      }));
    });

    var body = document.getElementsByTagName('body')[0];
    var $body = $(body);
    var leftOffset = body.getBoundingClientRect().left;
    $body.css('margin-left', leftOffset + 'px');

    $(window).resize(function(e){
      $body.css('margin-left', 'auto');
      leftOffset = body.getBoundingClientRect().left;
      console.log(leftOffset);
      $body.css('margin-left', leftOffset + 'px');
    });

    dropdown.data('height', resources.jobCategories.length * 25);

    var careerView = new CareerView(resources);
    var projectsView = new ProjectsView(resources.projects);

    var Router = Backbone.Router.extend({
      routes: {
        '': 'activateHome',
        'about': 'activateAbout',
        'contacts': 'activateContacts',
        'projects': 'activateProjects',
        'projects/:id': 'activateCurrentProject',
        'career': 'activateCareer',
        'career/type=:id': 'showJobsByID',
        'career/job=:id': 'showJob'
      },

      content: $('#content-container'),

      activateHome: function(){
        $.fn.switchTab();

        var self = this;
        this.content.fadeOut(config.fadeTime, function(){
          $.fn.clearBase();
          self.content.find('#content').html('<div class="career-content">'+
            resources.loadRes('home/', 'html')+
          '</div>');
          self.content.fadeIn(config.fadeTime);
        });
      },

      activateAbout: function(){
        $.fn.switchTab($('#about'));

        var self = this;
        this.content.fadeOut(config.fadeTime, function(){
          $.fn.clearBase();
          self.content.find('#content').html('<div class="career-content">'+
            resources.loadRes('about/', 'html')+
          '</div>');
          self.content.fadeIn(config.fadeTime);
        });
      },

      activateContacts: function(){
        $.fn.switchTab($('#contacts'));

        var self = this;
        this.content.fadeOut(config.fadeTime, function(){
          $.fn.clearBase();
          self.content.find('#content').html('<div class="career-content">'+
            resources.loadRes('contacts/', 'html')+
          '</div>');
          self.content.fadeIn(config.fadeTime);
        });
      },

      activateProjects: function(){
        $.fn.switchTab($('#projects'));

        var self = this;
        $.fn.clearBase();
        this.content.fadeOut(config.fadeTime, function(){
          projectsView.render();
          self.content.fadeIn(config.fadeTime);
        });
      },

      activateCurrentProject: function(id){
        $.fn.switchTab($('#projects'));
        $.fn.clearBase('projects');
        projectsView.render(id);
      },

      activateCareer: function(){
        $.fn.switchTab($('#career'));

        var self = this;
        $.fn.clearBase();
        this.content.fadeOut(config.fadeTime, function(){
          careerView.render();
          self.content.fadeIn(config.fadeTime);
        });
      },

      showJobsByID: function(id){
        $.fn.switchTab($('#career'));
        $.fn.clearBase('career');
        careerView.showJobs(id);
      },

      showJob: function(id){
        $.fn.switchTab($('#career'));
        $.fn.clearBase('career');
        careerView.showJob(id);
      }
    });

    var router = new Router();

    Backbone.history.start();
  });
});