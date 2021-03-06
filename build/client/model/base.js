// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'underscore'], function(Backbone, _) {
    var BaseModel;
    return BaseModel = (function(_super) {

      __extends(BaseModel, _super);

      BaseModel.prototype.idAttribute = "_id";

      function BaseModel(attributes, options) {
        if (options == null) {
          options = {};
        }
        this.collection = options.collection;
        BaseModel.__super__.constructor.call(this, attributes, options);
      }

      BaseModel.prototype.parseIdLookup = function(collectionName, fieldName, data) {
        var datum, isArrayOfIds, item,
          _this = this;
        if (!(this.collection != null)) {
          console.log("Warning: no collection");
          return;
        }
        if (this.collection[collectionName] != null) {
          if (!(data[fieldName] != null)) {
            console.log("Warning: data has no field " + fieldName);
            return;
          }
          datum = data[fieldName];
          isArrayOfIds = (_.isArray(datum)) && _.any(datum, function(thing) {
            return (_.isNumber(thing)) || (_.isString(thing));
          });
          if (isArrayOfIds) {
            return data[fieldName] = _.map(data[fieldName], function(id) {
              var item;
              item = _this.collection[collectionName].get(id);
              return item != null ? item : id;
            });
          } else if ((_.isNumber(data[fieldName])) || (_.isString(data[fieldName]))) {
            item = this.collection[collectionName].get(data[fieldName]);
            return data[fieldName] = item != null ? item : data[fieldName];
          }
        } else {
          return console.log("Warning: no " + collectionName + " property on collection");
        }
      };

      return BaseModel;

    })(Backbone.Model);
  });

}).call(this);
