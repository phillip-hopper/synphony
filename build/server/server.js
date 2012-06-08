// Generated by CoffeeScript 1.3.3
(function() {
  var compileStyle, express, fs, jsondb, less, path, staticFile;

  express = require('express');

  jsondb = require('./jsondb');

  less = require('less');

  fs = require('fs');

  path = require('path');

  staticFile = function(root, path) {
    return function(req, res) {
      var next;
      next = function(err) {
        if (err) {
          console.log(err);
          return res.send(500);
        } else {
          return res.send(404);
        }
      };
      return express["static"].send(req, res, next, {
        getOnly: true,
        root: __dirname + '/../..' + root,
        path: path
      });
    };
  };

  compileStyle = function(callback) {
    return fs.readFile(__dirname + '/../../src/style/synphony.less', 'utf8', function(err, data) {
      var options;
      if (err) {
        return callback(err);
      }
      console.log(path.resolve(__dirname, '../../src/style/'));
      options = {
        paths: [path.resolve(__dirname, '../../src/style/')],
        filename: "synphony.less",
        file: "synphony.less"
      };
      return less.render(data, options, function(err, css) {
        return callback(err, css);
      });
    });
  };

  module.exports.run = function() {
    var app, db, port;
    app = express.createServer();
    db = new jsondb.JsonDb(__dirname + '/../../data/db.json');
    db.load();
    app.use(express.favicon());
    app.use(express.logger());
    app.use(express["static"](__dirname + '/../../public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.get('/js/synphony.js', staticFile('/build/client', 'synphony.js'));
    app.get('/js/templates.js', staticFile('/build/client', 'templates.js'));
    app.get('/css/synphony.css', function(req, res) {
      return compileStyle(function(error, css) {
        if (error) {
          return res.send(500, error);
        } else {
          res.contentType('text/css');
          return res.send(css);
        }
      });
    });
    app.get('/api/v1/:collection/?', function(req, res) {
      return res.json(db.all(req.params.collection));
    });
    app.post('/api/v1/:collection/?', function(req, res) {
      return res.json(db.put(req.params.collection, req.body));
    });
    app.get('/api/v1/:collection/:id/?', function(req, res) {
      return res.json(db.get(req.params.collection, req.params.id));
    });
    app.put('/api/v1/:collection/:id/?', function(req, res) {
      req.body.id = req.params.id;
      return res.json(db.put(req.params.collection, req.body));
    });
    app["delete"]('/api/v1/:collection/:id/?', function(req, res) {
      return res.json(db["delete"](req.params.collection, req.params.id));
    });
    port = 3000;
    app.listen(port);
    return console.log("You may go to http://localhost:" + port + "/ in your browser");
  };

}).call(this);
