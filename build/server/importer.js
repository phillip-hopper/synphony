// Generated by CoffeeScript 1.3.3
(function() {
  var EventEmitter, Importer, foreignKeys, fs, thedb, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  thedb = require('./db');

  EventEmitter = require('events').EventEmitter;

  _ = require('underscore')._;

  fs = require('fs');

  foreignKeys = {
    gpcs: ["phoneme", "grapheme"],
    words: ["gpcs"],
    sentences: ["words"],
    sequences: [
      {
        elements: ["gpc", "new_words", "new_sentences"]
      }
    ]
  };

  Importer = (function(_super) {

    __extends(Importer, _super);

    function Importer(databaseUrl, projectName, filename) {
      this.databaseUrl = databaseUrl;
      this.projectName = projectName;
      this.filename = filename;
      this.objectIds = {};
      this.on("start", _.bind(this.loadJson, this));
      this.on("json-loaded", _.bind(this.loadDatabase, this));
      this.on("database-loaded", _.bind(this.ensureCollections, this));
      this.on("collections-ensured", _.bind(this.nextCollection, this));
      this.on("collection-selected", _.bind(this.fixDocumentIds, this));
      this.on("ids-fixed", _.bind(this.nextDocument, this));
      this.on("collection-done", _.bind(this.nextCollection, this));
      this.on("document-selected", _.bind(this.insertDocument, this));
      this.on("document-inserted", _.bind(this.nextDocument, this));
      this.on("collections-done", _.bind(this.done, this));
    }

    Importer.prototype.run = function() {
      return this.emit("start");
    };

    Importer.prototype.loadJson = function() {
      var _this = this;
      return fs.readFile(this.filename, 'utf8', this.whenDone("json-loaded", function(data) {
        return _this.data = JSON.parse(data);
      }));
    };

    Importer.prototype.loadDatabase = function() {
      this.db = new thedb.Db(this.databaseUrl);
      return this.db.load(this.whenDone("database-loaded"));
    };

    Importer.prototype.ensureCollections = function() {
      this.collectionNames = _.keys(this.data);
      console.log("Ensuring collections");
      return this.db.ensureCollections(this.projectName, this.collectionNames, this.whenDone("collections-ensured"));
    };

    Importer.prototype.nextCollection = function() {
      this.collectionName = this.collectionNames.shift();
      if (!(this.collectionName != null)) {
        return this.emit("collections-done");
      } else {
        console.log(this.collectionName);
        this.collectionData = this.data[this.collectionName];
        return this.emit("collection-selected");
      }
    };

    Importer.prototype.fixDocumentIds = function() {
      if (foreignKeys[this.collectionName] != null) {
        this.mapForeignKeys(this.collectionData, foreignKeys[this.collectionName]);
      }
      return this.emit("ids-fixed");
    };

    Importer.prototype.nextDocument = function() {
      var _ref,
        _this = this;
      this.document = this.collectionData.shift();
      if (!(this.document != null)) {
        return this.emit("collection-done");
      } else {
        console.log("  " + ((_ref = this.document.name) != null ? _ref : this.document.id));
        return process.nextTick(function() {
          return _this.emit("document-selected");
        });
      }
    };

    Importer.prototype.insertDocument = function() {
      var id, query,
        _this = this;
      id = this.document.id;
      delete this.document.id;
      query = null;
      if (this.document.name != null) {
        query = {
          name: this.document.name
        };
      }
      return this.db.put(this.projectName, this.collectionName, query, this.document, this.whenDone("document-inserted", function(result) {
        _this.objectIds[id] = result._id.toString();
        return console.log("    " + id + " => " + result._id);
      }));
    };

    Importer.prototype.done = function() {
      console.log("\ndone");
      return this.db.close();
    };

    Importer.prototype.whenDone = function(event, handler) {
      var _this = this;
      return function(err, result) {
        if (err != null) {
          console.error(err);
          return _this.emit("error", err);
        } else {
          if (handler != null) {
            handler(result);
          }
          return _this.emit(event);
        }
      };
    };

    Importer.prototype.mapForeignKeys = function(collectionData, foreignKeys) {
      var data, field, fields, id, key, _i, _len, _results;
      if (!(collectionData != null)) {
        return;
      }
      _results = [];
      for (_i = 0, _len = collectionData.length; _i < _len; _i++) {
        data = collectionData[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = foreignKeys.length; _j < _len1; _j++) {
            field = foreignKeys[_j];
            if (!_.isString(field)) {
              _results1.push((function() {
                var _results2;
                _results2 = [];
                for (key in field) {
                  fields = field[key];
                  _results2.push(this.mapForeignKeys(data[key], fields));
                }
                return _results2;
              }).call(this));
            } else if (_.isArray(data[field])) {
              _results1.push(data[field] = (function() {
                var _k, _len2, _ref, _results2;
                _ref = data[field];
                _results2 = [];
                for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                  id = _ref[_k];
                  if (!(this.objectIds[id] != null)) {
                    console.error("    Bad array id: " + id);
                  }
                  _results2.push(this.objectIds[id]);
                }
                return _results2;
              }).call(this));
            } else {
              if (!(this.objectIds[data[field]] != null)) {
                console.error("    Bad id: " + data[field]);
              }
              _results1.push(data[field] = this.objectIds[data[field]]);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Importer;

  })(EventEmitter);

  module.exports.run = function() {
    var databaseUrl, filename, projectName, _ref;
    _ref = _.rest(process.argv, 2), databaseUrl = _ref[0], projectName = _ref[1], filename = _ref[2];
    console.log("Importing " + filename + " into project " + projectName + " in database " + databaseUrl);
    return (new Importer(databaseUrl, projectName, filename)).run();
  };

}).call(this);
