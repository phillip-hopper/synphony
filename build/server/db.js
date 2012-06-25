// Generated by CoffeeScript 1.3.1
(function() {
  var Db, mongo, _;

  mongo = require('mongodb');

  _ = require('underscore')._;

  Db = (function() {

    Db.name = 'Db';

    function Db(database, host, port) {
      if (host == null) {
        host = "127.0.0.1";
      }
      if (port == null) {
        port = 27017;
      }
      this.db_connector = new mongo.Db(database, new mongo.Server(host, port, {}));
    }

    Db.prototype.load = function(done) {
      var _this = this;
      if (this.db != null) {
        if (done != null) {
          done(null);
        }
        return;
      }
      return this.db_connector.open(function(err, db) {
        _this.db = db;
        if (done != null) {
          return done(err);
        }
      });
    };

    Db.prototype.ensureCollections = function(collectionNames, done) {
      var _this = this;
      return this.db.collectionNames(function(err, existingNames) {
        var col, nonexistingNames;
        existingNames = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = existingNames.length; _i < _len; _i++) {
            col = existingNames[_i];
            if (col.options != null) {
              _results.push(col.options.create);
            }
          }
          return _results;
        })();
        nonexistingNames = _.difference(collectionNames, existingNames);
        return _this.createCollections(nonexistingNames, done);
      });
    };

    Db.prototype.createCollections = function(collectionNames, done) {
      var collectionName,
        _this = this;
      if (collectionNames.length === 0) {
        return done(null);
      }
      collectionName = collectionNames.shift();
      return this.db.createCollection(collectionName, {
        safe: true
      }, function(err) {
        if (err != null) {
          return done(err);
        }
        return _this.createCollections(collectionNames, done);
      });
    };

    Db.prototype.all = function(collectionName, query, done) {
      query = this.patchObjectID(query);
      return this.db.collection(collectionName, function(err, collection) {
        if (err != null) {
          return done(err);
        }
        return collection.find(query).toArray(function(err, docs) {
          return done(err, docs);
        });
      });
    };

    Db.prototype.get = function(collectionName, query, done) {
      query = this.patchObjectID(query);
      return this.db.collection(collectionName, function(err, collection) {
        if (err != null) {
          return done(err);
        }
        return collection.findOne(query, function(err, doc) {
          return done(err, doc);
        });
      });
    };

    Db.prototype.put = function(collectionName, query, doc, done) {
      query = this.patchObjectID(query);
      doc = this.patchObjectID(doc);
      return this.db.collection(collectionName, function(err, collection) {
        if (err != null) {
          return done(err);
        }
        if (!(query != null) && (doc._id != null)) {
          query = {
            _id: doc._id
          };
        }
        if (query != null) {
          return collection.findAndModify(query, [], doc, {
            upsert: true,
            "new": true,
            safe: true
          }, function(err, doc) {
            return done(err, doc);
          });
        } else {
          return collection.insert(doc, {
            safe: true
          }, function(err, doc) {
            return done(err, doc);
          });
        }
      });
    };

    Db.prototype["delete"] = function(collectionName, query, done) {
      query = this.patchObjectID(query);
      return this.db.collection(collectionName, function(err, collection) {
        if (err != null) {
          return done(err);
        }
        return collection.remove(query, {
          safe: true
        }, function(err) {
          return done(err);
        });
      });
    };

    Db.prototype.close = function() {
      return this.db.close();
    };

    Db.prototype.patchObjectID = function(obj) {
      if (!(obj != null)) {
        return obj;
      }
      if ((obj._id != null) && !(obj._id instanceof mongo.ObjectID)) {
        obj._id = mongo.ObjectID(obj._id);
      }
      return obj;
    };

    return Db;

  })();

  exports.Db = Db;

  exports.ObjectID = mongo.ObjectID;

}).call(this);
