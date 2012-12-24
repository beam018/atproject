define(['backbone', 'handlebars'], function(Backbone, handlebars){
  'use strict';

  var JobView = Backbone.View.extend({
    tagName: 'div',
    template: $('#job-template'),
    render: function(data, parentId, id){
      var _data = data;
      var _parentId = parentId;
      var _id = id;

      var dataRow = _data.get(_parentId).toJSON();

      var data = _.find(dataRow.model, function(item){
        return item.id == _id;
      });

      var templateSource = this.template.html();
      var template = handlebars.compile(templateSource);
      var html = template({
        parent: dataRow,
        model: data
      });

      this.$el.html(html);
    }
  });

  return JobView;
});