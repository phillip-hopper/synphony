// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['interactor/base'], function(BaseInteractor) {
    var Segmenter;
    return Segmenter = (function(_super) {

      __extends(Segmenter, _super);

      function Segmenter(words, gpcs) {
        this.words = words;
        this.gpcs = gpcs;
      }

      Segmenter.prototype.run = function(callback) {
        this.segment();
        return callback(null, null);
      };

      Segmenter.prototype.segment = function() {
        var gpcs,
          _this = this;
        gpcs = this.gpcs.sortBy(function(gpc) {
          return gpc.graphemeName().length;
        });
        gpcs = gpcs.reverse();
        return this.words.each(function(word) {
          var foundGpc, gpc, remaining, wordGpcs, _i, _len;
          remaining = (word.get('name')).toLowerCase();
          wordGpcs = [];
          while (remaining !== '') {
            foundGpc = null;
            for (_i = 0, _len = gpcs.length; _i < _len; _i++) {
              gpc = gpcs[_i];
              if ((remaining.indexOf(gpc.graphemeName())) === 0) {
                foundGpc = gpc;
                break;
              }
            }
            if (!foundGpc) {
              wordGpcs = null;
              break;
            }
            remaining = remaining.substring(gpc.graphemeName().length);
            wordGpcs.push(foundGpc);
          }
          if (!(word.set({
            gpcs: wordGpcs
          }))) {
            throw new Error("Invalid word!");
          }
        });
      };

      return Segmenter;

    })(BaseInteractor);
  });

}).call(this);
