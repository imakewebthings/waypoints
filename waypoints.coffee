$ = window.jQuery
$w = $(window)
allWaypoints = {}
contextCounter = 1
contexts = {}
contextKey = 'waypoints-context-id'
resizeEvent = 'resize.waypoints'
scrollEvent = 'scroll.waypoints'
waypointCounter = 1
waypointEvent = 'waypoint.reached'
waypointKey = 'waypoints-waypoint-ids'
wp = 'waypoint'
wps = 'waypoints'
window.contexts = contexts


getWaypointsByElement = (element) ->
  ids = $(element).data waypointKey
  $.map ids, (id) ->
    allWaypoints[id]


class Context
  constructor: ($element) ->
    @$element = $element
    @element = $element[0]
    @didResize = no
    @didScroll = no
    @id = contextCounter++
    @oldScroll = 0
    @waypoints = {}
    
    $element.data contextKey, @id

    contexts[@id] = this

    $element.bind scrollEvent, =>
      unless @didScroll
        @didScroll = yes
        scrollHandler = =>
          @doScroll()
          @didScroll = no
        window.setTimeout scrollHandler, $[wps].settings.scrollThrottle

    $element.bind resizeEvent, =>
      unless @didResize
        @didResize = yes
        resizeHandler = =>
          $[wps] 'refresh'
          @didResize = no
        window.setTimeout resizeHandler, $[wps].settings.resizeThrottle

  doScroll: ->
    newScroll = @$element.scrollTop()
    isDown = newScroll > @oldScroll
    waypointsHit = []

    $.each @waypoints, (key, waypoint) =>
      if isDown
        hit = @oldScroll < waypoint.offset <= newScroll
      else
        hit = newScroll < waypoint.offset <= @oldScroll
      if hit
        waypointsHit.push waypoint
      true

    length = waypointsHit.length

    $[wps] 'refresh' unless @oldScroll && newScroll

    @oldScroll = newScroll

    return unless length

    waypointsHit.sort (a, b) -> a.offset - b.offset
    waypointsHit.reverse() unless isDown

    $.each waypointsHit, (i, waypoint) =>
      if waypoint.options.continuous or i is length - 1
        waypoint.trigger [if isDown then 'down' else 'up']

  refresh: (waypoints) ->
    isWin = $.isWindow @element
    contextOffset = contextScroll = 0
    contextHeight = $[wps] 'viewportHeight'
    unless isWin
      contextOffset = @$element.offset().top
      contextHeight = @$element.height()
      contextScroll = @$element.scrollTop()
    waypoints ?= @waypoints

    $.each waypoints, (i, waypoint) =>
      adjustment = waypoint.options.offset
      oldOffset = waypoint.offset

      if $.isFunction waypoint.options.offset
        adjustment = waypoint.options.offset.apply waypoint.element
      else if typeof waypoint.options.offset is 'string'
        adjustment = parseFloat waypoint.options.offset
        if waypoint.options.offset.indexOf '%'
          adjustment = Math.ceil(contextHeight * adjustment / 100)

      waypoint.offset = waypoint.$element.offset().top \
                        - contextOffset \
                        + contextScroll \
                        - adjustment

      return if waypoint.options.onlyOnScroll or !waypoint.enabled

      if oldOffset isnt null && oldOffset < @oldScroll <= waypoint.offset
        waypoint.trigger ['up']
      else if oldOffset isnt null && oldOffset > @oldScroll >= waypoint.offset
        waypoint.trigger ['down']
      else if oldOffset is null && @$element.scrollTop() > waypoint.offset
        waypoint.trigger ['down']



  checkEmpty: ->
    if $.isEmptyObject @waypoints
      delete contexts[@id]









class Waypoint
  constructor: ($element, context, options) ->
    options = $.extend {}, $.fn[wp].defaults, options
    if options.offset is 'bottom-in-view'
      options.offset = ->
        contextHeight = $[wps] 'viewportHeight'
        unless $.isWindow context.element
          contextHeight = context.$element.height()
        contextHeight - $(this).outerHeight()

    @$element = $element
    @element = $element[0]
    @options = options
    @offset = null
    @f = options?.handler
    @context = context
    @id = waypointCounter++
    @enabled = options.enabled

    context.waypoints[@id] = this
    allWaypoints[@id] = this
    idList = $element.data(waypointKey) ? []
    idList.push @id
    $element.data waypointKey, idList
    $element.data 'waypointPlugin', this
  
  trigger: (args) ->
    return unless @enabled
    if @f?
      @f.apply @element, args
    @$element.trigger waypointEvent, args
    if @options.triggerOnce
      @destroy()

  disable: ->
    @enabled = false

  enable: ->
    @context.refresh [this]
    @enabled = true

  destroy: ->
    delete allWaypoints[@id]
    delete @context.waypoints[@id]
    @context.checkEmpty()









methods =
  init: (f, options) ->
    options ?= {}
    options.handler ?= f

    @each ->
      $this = $ this
      contextElement = options.context ? $.fn[wp].defaults.context

      unless $.isWindow contextElement
        contextElement = $this.closest contextElement
      contextElement = $ contextElement
      context = contexts[contextElement.data contextKey]
      context = new Context contextElement unless context
      new Waypoint $this, context, options
    $[wps] 'refresh'
    this

  disable: -> methods._invoke this, 'disable'
  enable: -> methods._invoke this, 'enable'
  destroy: -> methods._invoke this, 'destroy'

  _invoke: ($elements, method) ->
    $elements.each ->
      waypoints = getWaypointsByElement this
      $.each waypoints, (i, waypoint) -> waypoint[method]()
    this



$.fn[wp] = (method, args...) ->
  if methods[method]
    methods[method].apply this, args
  else if $.isFunction(method) or !method
    methods.init.apply this, arguments
  else if $.isPlainObject(method)
    methods.init.apply this, [null, method]
  else
    $.error "The #{method} method does not exist in jQuery Waypoints."


$.fn[wp].defaults =
  continuous: true
  offset: 0
  triggerOnce: false
  context: window
  enabled: true













jQMethods =
  refresh: ->
    $.each contexts, (i, context) -> context.refresh()
  
  viewportHeight: ->
    window.innerHeight ? $w.height()

  aggregate: ->
    waypoints = []
    $.each contexts, (i, context) ->
      $.each context.waypoints, (j, waypoint) -> waypoints.push waypoint
    waypoints.sort (a, b) -> a.offset - b.offset
    $.map waypoints, (waypoint) -> waypoint.$element






$[wps] = (method) ->
  if jQMethods[method]
    jQMethods[method]()
  else
    jQMethods.aggregate()

$[wps].settings =
  resizeThrottle: 200
  scrollThrottle: 100

$w.load -> $[wps] 'refresh'