define ['underscore', 'backbone'],
(_, Backbone) ->
  # Base view with some extensions that make sense. Most stolen
  # from Backbone.Marionette.
  #
  # Subclasses have a easy way to destroy which will clean up
  # the DOM and events.
  #
  # Also there's `triggers` which can be used to forward DOM
  # events to anyone listening to this view.
  class BaseView extends Backbone.View
    constructor: (options={}) ->
      @interactor = options.interactor
      super options

    # Destroy the view taking care to remove event handlers so
    # it will be garbage collected properly, as well as removing
    # it from the DOM. A `destroy` event is triggered immediately
    # prior to removing all listeners. Any interactor will
    # also be destroyed, which will remove any event listeners
    # on that interactor as well.
    destroy: ->
      # remove all event handlers in the DOM
      @undelegateEvents()

      # remove our element from the DOM
      @remove()

      # let event listeners know we closed
      @trigger 'destroy'

      # nuke any attached interactors
      @interactor?.destroy()

      # remove all event listeners
      @off()
      console.log "Destroyed"

    # Render a sub-view to a selector after a template has been rendered. This
    # ensures that events are re-delegated properly.
    # @param [String] selector jQuery css selector of the subview in the template
    # @param [Backbone.View] view the view to render into the selector
    # idea from http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
    renderToSelector: (selector, view) ->
        (view.setElement @$ selector).render()

    # @private
    delegateEvents: (events = @events) ->
      events = events() if _.isFunction events

      combinedEvents = {}
      _.extend combinedEvents, events, @prepareTriggers()

      super combinedEvents

    # @private
    prepareTriggers: ->
      return {} if not @triggers
      triggers = @triggers
      # allow triggers to be a function and call it
      triggers = triggers() if _.isFunction triggers

      events = {}
      _.each triggers, (value, key) =>
        events[key] = (e) =>
          e?.preventDefault?()
          e?.stopPropagation?()
          @trigger value

      events
