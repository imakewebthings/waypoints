$ = window.jQuery
$w = $ window
allWaypoints = 
  horizontal: {}
  vertical: {}
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

class Context
  constructor: ($element) ->
    @$element = $element
    @element = $element[0]
    @didResize = no
    @didScroll = no
    @id = 'context' + contextCounter++
    @oldScroll =
      x: $element.scrollLeft()
      y: $element.scrollTop()
    @waypoints =
      vertical: {}
      horizontal: {}
    
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
    axes =
      horizontal:
        newScroll: @$element.scrollLeft()
        oldScroll: @oldScroll.x
        forward: 'right'
        backward: 'left'
      vertical:
        newScroll: @$element.scrollTop()
        oldScroll: @oldScroll.y
        forward: 'down'
        backward: 'up'

    if 'ontouchstart' in window \
      and (!axes.vertical.oldScroll or !axes.vertical.newScroll)
        $[wps] 'refresh'

    $.each axes, (aKey, axis) =>
      triggered = []
      isForward = axis.newScroll > axis.oldScroll
      direction = if isForward then axis.forward else axis.backward
      $.each @waypoints[aKey], (wKey, waypoint) ->
        if axis.oldScroll < waypoint.offset <= axis.newScroll
          triggered.push waypoint
        else if axis.newScroll < waypoint.offset <= axis.oldScroll
          triggered.push waypoint
      triggered.sort (a, b) -> a.offset - b.offset
      triggered.reverse() unless isForward
      $.each triggered, (i, waypoint) ->
        if waypoint.options.continuous or i is triggered.length - 1
          waypoint.trigger [direction]

    @oldScroll =
      x: axes.horizontal.newScroll
      y: axes.vertical.newScroll

  refresh: () ->
    isWin = $.isWindow @element
    cOffset = @$element.offset()
    axes =
      horizontal:
        contextOffset: if isWin then 0 else cOffset.left
        contextScroll: if isWin then 0 else @oldScroll.x
        contextDimension: @$element.width()
        oldScroll: @oldScroll.x
        forward: 'right'
        backward: 'left'
      vertical:
        contextOffset: if isWin then 0 else cOffset.top
        contextScroll: if isWin then 0 else @oldScroll.y
        contextDimension: if isWin then $[wps]('viewportHeight') else \
          @$element.height()
        oldScroll: @oldScroll.y
        forward: 'down'
        backward: 'up'

    $.each axes, (aKey, axis) =>
      $.each @waypoints[aKey], (i, waypoint) ->
        adjustment = waypoint.options.offset
        oldOffset = waypoint.offset

        if $.isFunction adjustment
          adjustment = adjustment.apply waypoint.element
        else if typeof adjustment is 'string'
          adjustment = parseFloat adjustment
          if waypoint.options.offset.indexOf '%'
            adjustment = Math.ceil(axis.contextDimension * adjustment / 100)

        waypoint.offset = waypoint.$element.offset().top \
                        - axis.contextOffset \
                        + axis.contextScroll \
                        - adjustment

        return if waypoint.options.onlyOnScroll or !waypoint.enabled
        
        if @$element.data 'flag'
          console.log oldOffset, axis, waypoint

        if oldOffset isnt null and \
          oldOffset < axis.oldScroll <= waypoint.offset
            waypoint.trigger [axis.backward]
        else if oldOffset isnt null and \
          oldOffset > axis.oldScroll >= waypoint.offset
            waypoint.trigger [axis.forward]
        else if oldOffset is null and axis.oldScroll > waypoint.offset
          waypoint.trigger [axis.forward]

  checkEmpty: ->
    if $.isEmptyObject @waypoints.horizontal and \
      $.isEmptyObject @waypoints.vertical
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
    @axis = if options.horizontal then 'horizontal' else 'vertical'
    @callback = options.handler
    @context = context
    @enabled = options.enabled
    @id = 'waypoints' + waypointCounter++
    @offset = null
    @options = options

    context.waypoints[@axis][@id] = this
    allWaypoints[@axis][@id] = this
    idList = $element.data(waypointKey) ? []
    idList.push @id
    $element.data waypointKey, idList
    $element.data 'waypointPlugin', this
  
  trigger: (args) ->
    return unless @enabled
    if @callback?
      @callback.apply @element, args
    @$element.trigger waypointEvent, args
    if @options.triggerOnce
      @destroy()

  disable: ->
    @enabled = false

  enable: ->
    @context.refresh [this]
    @enabled = true

  destroy: ->
    delete allWaypoints[@axis][@id]
    delete @context.waypoints[@axis][@id]
    @context.checkEmpty()

  @getWaypointsByElement: (element) ->
    ids = $(element).data waypointKey
    return [] unless ids
    all = $.extend {}, allWaypoints.horizontal, allWaypoints.vertical
    $.map ids, (id) ->
      all[id]

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
      waypoints = Waypoint.getWaypointsByElement this
      $.each waypoints, (i, waypoint) ->
        waypoint[method]()
        true
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
  context: window
  continuous: true
  enabled: true
  horizontal: false
  offset: 0
  triggerOnce: false
  

jQMethods =
  refresh: ->
    $.each contexts, (i, context) -> context.refresh()
  
  viewportHeight: ->
    window.innerHeight ? $w.height()

  aggregate: ->
    waypoints =
      horizontal: []
      vertical: []
    $.each waypoints, (axis, arr) ->
      $.each allWaypoints[axis], (key, waypoint) ->
        arr.push waypoint
      arr.sort (a, b) -> a.offset - b.offset
      waypoints[axis] = $.map arr, (waypoint) -> waypoint.element
      waypoints[axis] = $.unique waypoints[axis]
    waypoints

$[wps] = (method) ->
  if jQMethods[method] then jQMethods[method]() else jQMethods.aggregate()

$[wps].settings =
  resizeThrottle: 200
  scrollThrottle: 100

$w.load -> $[wps] 'refresh'