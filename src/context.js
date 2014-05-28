(function() {
  var keyCounter = 0
  var contexts = {}

  var Context = function(element) {
    this.element = element
    this.$element = $(element)
    this.key = 'waypoint-context-' + keyCounter
    this.didScroll = false
    this.didResize = false
    this.oldScroll = {
      x: this.$element.scrollLeft(),
      y: this.$element.scrollTop()
    }
    this.waypoints = {
      vertical: {},
      horizontal: {}
    }

    element.waypointContextKey = this.key
    contexts[element.waypointContextKey] = this
    keyCounter += 1

    this.createThrottledScrollHandler()
    this.createThrottledResizeHandler()
  }

  Context.prototype.createThrottledScrollHandler = function() {
    var scrollHandler = $.proxy(function() {
      this.handleScroll()
      this.didScroll = false
    }, this)

    this.$element.on('scroll.waypoints', $.proxy(function() {
      if (!this.didScroll || Waypoint.isTouch) {
        this.didScroll = true
        window.setTimeout(scrollHandler, Waypoint.settings.scrollThrottle)
      }
    }, this))
  }

  Context.prototype.createThrottledResizeHandler = function() {
    var resizeHandler = $.proxy(function() {
      this.handleResize()
      this.didResize = false
    }, this)

    this.$element.on('resize.waypoints', $.proxy(function() {
      if (!this.didResize) {
        this.didResize = true
        window.setTimeout(resizeHandler, Waypoint.settings.resizeThrottle)
      }
    }))
  }

  Context.prototype.handleScroll = function(options) {
    var axes = {
      horizontal: {
        newScroll: this.$element.scrollLeft(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left'
      },
      vertical: {
        newScroll: this.$element.scrollTop(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up'
      }
    }
    var atTop = !axes.vertical.oldScroll || !axes.vertical.newScroll
    var skipIOSRefresh = options && options.skipIOSRefresh

    /* Hack for iOS, needed because scrolls in mobile Safari that start
     * or end with the URL bar showing will cause window height to change
     * without firing a resize event. */
    if (Waypoint.isTouch && atTop && !skipIOSRefresh) {
      this.refresh()
    }

    $.each(axes, $.proxy(function(axisKey, axis) {
      var triggered = []
      var isForward = axis.newScroll > axis.oldScroll
      var direction = isForward ? axis.forward : axis.backward

      $.each(this.waypoints[axisKey], function(waypointKey, waypoint) {
        var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
        var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
        var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
        var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
        if (crossedForward || crossedBackward) {
          triggered.push(waypoint)
        }
      })

      triggered.sort(function(a, b) {
        return a.triggerPoint - b.triggerPoint
      })
      if (!isForward) {
        triggered.reverse()
      }
      $.each(triggered, function(i, waypoint) {
        if (waypoint.options.continuous || i === triggered.length - 1) {
          waypoint.trigger([direction])
        }
      })
    }, this))

    this.oldScroll = {
      x: axes.horizontal.newScroll,
      y: axes.vertical.newScroll
    }
  }

  Context.prototype.handleResize = function() {
    Waypoint.refresh()
  }

  Context.prototype.refresh = function() {
    var isWindow = $.isWindow(this.element)
    var contextOffset = this.$element.offset()
    var height = isWindow ? Waypoint.viewportHeight() : this.$element.height()
    var axes

    this.handleScroll({
      skipIOSRefresh: true
    })
    axes = {
      horizontal: {
        contextOffset: isWindow ? 0 : contextOffset.left,
        contextScroll: isWindow ? 0 : this.oldScroll.x,
        contextDimension: this.$element.width(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left',
        offsetProp: 'left'
      },
      vertical: {
        contextOffset: isWindow ? 0 : contextOffset.top,
        contextScroll: isWindow ? 0 : this.oldScroll.y,
        contextDimension: height,
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up',
        offsetProp: 'top'
      }
    }

    $.each(axes, $.proxy(function(axisKey, axis) {
      $.each(this.waypoints[axisKey], function(i, waypoint) {
        var adjustment = waypoint.options.offset
        var oldTriggerPoint = waypoint.triggerPoint
        var elementOffset = 0
        var canTriggerOnRefresh = waypoint.canTriggerOnRefresh()
        var freshWaypoint = oldTriggerPoint == null
        var contextModifier

        if (!$.isWindow(waypoint.element)) {
          elementOffset = waypoint.$element.offset()[axis.offsetProp]
        }

        if (typeof adjustment === 'function') {
          adjustment = adjustment.apply(waypoint)
        }
        else if (typeof adjustment === 'string') {
          adjustment = parseFloat(adjustment)
          if (waypoint.options.offset.indexOf('%') > - 1) {
            adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
          }
        }

        contextModifier = axis.contextScroll - axis.contextOffset
        waypoint.triggerPoint = elementOffset + contextModifier - adjustment

        if (!canTriggerOnRefresh) {
          return
        }

        var wasBeforeScroll = oldTriggerPoint < axis.oldScroll
        var nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
        var triggeredBackward = wasBeforeScroll && nowAfterScroll
        var triggeredForward = !wasBeforeScroll && !nowAfterScroll
        if (!freshWaypoint && triggeredBackward) {
          waypoint.trigger([axis.backward])
        }
        else if (!freshWaypoint && triggeredForward) {
          waypoint.trigger([axis.forward])
        }
        else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
          waypoint.trigger([axis.forward])
        }
      })
    }, this))

    return this
  }

  /* Internal */
  Context.prototype.add = function(waypoint) {
    var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
    this.waypoints[axis][waypoint.key] = waypoint
    this.refresh()
  }

  /* Internal */
  Context.prototype.remove = function(waypoint) {
    delete this.waypoints[waypoint.axis][waypoint.key]
    this.checkEmpty()
  }

  /* Internal */
  Context.prototype.checkEmpty = function() {
    var horizontalEmpty = $.isEmptyObject(this.waypoints.horizontal)
    var verticalEmpty = $.isEmptyObject(this.waypoints.vertical)
    if (horizontalEmpty && verticalEmpty) {
      this.$element.off('.waypoints')
      delete contexts[this.key]
    }
  }

  /* Internal */
  Context.prototype.height = function() {
    if ($.isWindow(this.element)) {
      return Waypoint.viewportHeight()
    }
    return this.$element.height()
  }

  Context.refreshAll = function() {
    $.each(contexts, function(contextId, context) {
      context.refresh()
    })
  }

  /* Internal */
  Context.findByElement = function(element) {
    return contexts[element.waypointContextKey]
  }

  /* Internal */
  Context.findOrCreateByElement = function(element) {
    return Context.findByElement(element) || new Context(element)
  }

  window.Waypoint.Context = Context
})()
