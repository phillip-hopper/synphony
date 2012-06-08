define ['backbone', 'underscore'], (Backbone, _) ->
  # Base superclass for all SynPhony models.
  # Has some code to help with translating id numbers into
  # references while parsing.
  #
  # @abstract
  # @see http://backbonejs.org/#Model Backbone.Model
  class BaseModel extends Backbone.Model
    # Construct new model
    #
    # @param [Object] attributes Initial attributes of the model
    # @param [Object] options Options
    # @option options [NamedCollection] collection model's colleciton
    #
    # @see http://backbonejs.org/#Model-constructor Backbone.Model#constructor
    constructor: (attributes, options = {}) ->
      @collection = options.collection
      super attributes, options

    # Helper for parse() to convert id numbers into object references in a
    # more delarative way. Works on arrays of ids too.
    #
    # @param collectionName [String] name of the collection property of this
    #   model's collection
    # @param fieldName [String] name of the property in data to look up the
    #   id for
    # @param data [Object] the data to change ids to references in
    parseIdLookup: (collectionName, fieldName, data) ->
      if @collection? and @collection[collectionName]?
        if (_.isArray data[fieldName]) and (_.isNumber _.first data[fieldName])
          # array of ids
          data[fieldName] = _.map data[fieldName], (id) =>
            item = @collection[collectionName].get id
            item ? id
        else if _.isNumber data[fieldName]
          item = @collection[collectionName].get data[fieldName]
          data[fieldName] = item ? data[fieldName]