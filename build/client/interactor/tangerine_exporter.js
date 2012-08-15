// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['interactor/base', 'interactor/known_focus_search'], function(BaseInteractor, KnownFocusSearcher) {
    var TangerineExporter;
    return TangerineExporter = (function(_super) {

      __extends(TangerineExporter, _super);

      function TangerineExporter(options) {
        this.projectManager = options.projectManager, this.graphemesPerLesson = options.graphemesPerLesson, this.wordsPerLesson = options.wordsPerLesson, this.curriculumId = options.curriculumId, this.sequence = options.sequence;
        this.searcher = new KnownFocusSearcher(this.projectManager.getWords());
      }

      TangerineExporter.prototype.run = function(done) {
        return done(null, this.exportJson());
      };

      TangerineExporter.prototype.exportJson = function() {
        var gpcs, i, lessonGpcs, lessonWords, result, words, _i, _len;
        result = [];
        lessonGpcs = this.lessonGpcs();
        lessonWords = this.lessonWords(lessonGpcs);
        for (i = _i = 0, _len = lessonGpcs.length; _i < _len; i = ++_i) {
          gpcs = lessonGpcs[i];
          words = lessonWords[i];
          result = result.concat(this.generateSubtests(i + 1, gpcs, words));
        }
        return result;
      };

      TangerineExporter.prototype.generateUuid = function() {
        var s4;
        s4 = function() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
      };

      TangerineExporter.prototype.lessonGpcs = function() {
        var remaining, result;
        result = [];
        remaining = this.sequence.gpcs();
        while (remaining.length > 0) {
          result.push(_.first(remaining, this.graphemesPerLesson));
          remaining = _.rest(remaining, this.graphemesPerLesson);
        }
        return result;
      };

      TangerineExporter.prototype.allLessonWords = function(lessonGpcs) {
        var focusGpcs, knownGpcs, _i, _len, _results;
        knownGpcs = [];
        _results = [];
        for (_i = 0, _len = lessonGpcs.length; _i < _len; _i++) {
          focusGpcs = lessonGpcs[_i];
          knownGpcs = knownGpcs.concat(focusGpcs);
          _results.push(this.searcher.getKnownFocusItems(knownGpcs, focusGpcs));
        }
        return _results;
      };

      TangerineExporter.prototype.lessonWords = function(lessonGpcs) {
        var sortedWords;
        sortedWords = this.sortWords(this.allLessonWords(lessonGpcs));
        return this.trimLessonWords(sortedWords, this.wordsPerLesson);
      };

      TangerineExporter.prototype.sortWords = function(lessonWords) {
        var _this = this;
        return _.map(lessonWords, function(words) {
          words = _.sortBy(words, function(word) {
            return (_this.wordFrequency(word)) * 10000 + (_this.reversedWordLength(word));
          });
          return words.reverse();
        });
      };

      TangerineExporter.prototype.wordFrequency = function(word) {
        var _ref;
        return (_ref = word.get('frequency')) != null ? _ref : 0;
      };

      TangerineExporter.prototype.reversedWordLength = function(word) {
        return 1000 - (word.get('name')).length;
      };

      TangerineExporter.prototype.trimLessonWords = function(lessonWords, length) {
        return _.map(lessonWords, function(words) {
          return _.first(words, length);
        });
      };

      TangerineExporter.prototype.generateSubtests = function(lesson, gpcs, words) {
        return [this.generateSpellingPatternSubtest(lesson, gpcs), this.generateFamiliarWordsSubtest(lesson, words)];
      };

      TangerineExporter.prototype.generateSpellingPatternSubtest = function(lesson, gpcs) {
        var graphemes;
        graphemes = _.map(gpcs, function(gpc) {
          return gpc.graphemeName();
        });
        return _.extend(this.subtestHeader(lesson), {
          variableName: 'spellingPatterns',
          name: 'Spelling Patterns',
          items: graphemes
        });
      };

      TangerineExporter.prototype.generateFamiliarWordsSubtest = function(lesson, words) {
        words = _.map(words, function(word) {
          return word.get('name');
        });
        return _.extend(this.subtestHeader(lesson), {
          variableName: 'familiarWords',
          name: 'Familiar Words',
          items: words
        });
      };

      TangerineExporter.prototype.subtestHeader = function(lesson) {
        return {
          collection: 'subtest',
          prototype: 'grid',
          curriculumID: this.curriculumId,
          lesson: lesson
        };
      };

      return TangerineExporter;

    })(BaseInteractor);
  });

}).call(this);
