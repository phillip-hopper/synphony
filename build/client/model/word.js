// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['model/named'], function(NamedModel) {
    var Word;
    return Word = (function(_super) {

      __extends(Word, _super);

      Word.name = 'Word';

      function Word() {
        return Word.__super__.constructor.apply(this, arguments);
      }

      Word.prototype.parse = function(data) {
        this.parseIdLookup('gpcs', 'gpcs', data);
        return data;
      };

      return Word;

    })(NamedModel);
  });

}).call(this);