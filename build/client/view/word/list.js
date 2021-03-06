// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'view/common/base'], function(_, BaseView) {
    var WordListView;
    return WordListView = (function(_super) {

      __extends(WordListView, _super);

      WordListView.prototype.tagName = 'table';

      WordListView.prototype.id = 'word-list';

      function WordListView(options) {
        WordListView.__super__.constructor.call(this, options);
        this.columns = options.columns || 3;
        this.interactor.on('update', this.render, this);
      }

      WordListView.prototype.wordHTML = function(word) {
        var gpcs, html,
          _this = this;
        html = "<span class='word'>";
        gpcs = word.gpcs();
        _.each(gpcs, function(gpc) {
          return html += _this.gpcHTML(gpc);
        });
        html += "</span>";
        return html;
      };

      WordListView.prototype.gpcHTML = function(gpc) {
        var focus, known;
        known = "";
        if (this.interactor.isGpcKnown(gpc)) {
          known = "known";
        }
        focus = "";
        if (this.interactor.gpcHasFocus(gpc)) {
          focus = "focus";
        }
        return "<span class='" + known + " " + focus + "'>" + (gpc.graphemeName()) + "</span>";
      };

      WordListView.prototype.render = function() {
        var _this = this;
        this.interactor.run(function(error, words) {
          var column, html;
          column = 0;
          html = "<tr>";
          _.each(words, function(word) {
            html += "<td>" + _this.wordHTML(word) + "</td>";
            column += 1;
            if (column >= _this.columns) {
              column = 0;
              return html += "</tr><tr>";
            }
          });
          return _this.$el.html(html);
        });
        return this;
      };

      return WordListView;

    })(BaseView);
  });

}).call(this);
