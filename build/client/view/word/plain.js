// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['view/common/template', 'text!templates/word/plain.handlebars'], function(TemplateView, hbsTemplate) {
    var PlainWordView;
    return PlainWordView = (function(_super) {

      __extends(PlainWordView, _super);

      PlainWordView.name = 'PlainWordView';

      function PlainWordView() {
        return PlainWordView.__super__.constructor.apply(this, arguments);
      }

      PlainWordView.prototype.template = 'words/plain_word';

      PlainWordView.prototype.tagName = 'span';

      PlainWordView.prototype.tagClass = 'word';

      return PlainWordView;

    })(TemplateView);
  });

}).call(this);