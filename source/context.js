function isEmptyObject (obj) {
  for (var key in obj) {
    return false
  }
  return true
}

module.exports = function (DOM) {
  var keyCounter = 0
  var contexts = {}
  var reqAnimationFrame = (
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    requestAnimationFrameShim
  ).bind(window)

  function requestAnimationFrameShim (callback) {
    window.setTimeout(callback, 1000 / 60)
  }

  return class Context {
    constructor (element) {
      this.element = element
      this.dom = new DOM(element)
      this.key = `context-${keyCounter}`
      this.didScroll = false
      this.didResize = false
      this.oldScroll = {
        x: this.dom.scrollLeft(),
        y: this.dom.scrollTop()
      }
      this.waypoints = {
        vertical: {},
        horizontal: {}
      }

      element.waypointContextKey = this.key
      contexts[element.waypointContextKey] = this
      keyCounter += 1

      this.createThrottledScrollHandler()
      if (this.dom.isWindow) {
        this.createThrottledResizeHandler()
      }
    }

    createThrottledScrollHandler () {
      const scrollHandler = () => {
        this.handleScroll()
        this.didScroll = false
      }

      this.dom.on('scroll.waypoints', () => {
        if (!this.didScroll) {
          this.didScroll = true
          reqAnimationFrame(scrollHandler)
        }
      })
    }

    createThrottledResizeHandler () {
      const resizeHandler = () => {
        this.handleResize()
        this.didResize = false
      }

      this.dom.on('resize.waypoints', () => {
        if (!this.didResize) {
          this.didResize = true
          reqAnimationFrame(resizeHandler)
        }
      })
    }

    handleResize () {
      Context.refreshAll()
    }

    handleScroll () {
      var triggeredGroups = {}
      var axes = {
        horizontal: {
          newScroll: this.dom.scrollLeft(),
          oldScroll: this.oldScroll.x
        },
        vertical: {
          newScroll: this.dom.scrollTop(),
          oldScroll: this.oldScroll.y
        }
      }

      for (var axisKey in axes) {
        var axis = axes[axisKey]

        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey]
          var direction = waypoint.shouldScrollTrigger(axis.oldScroll, axis.newScroll)
          if (direction) {
            waypoint.group.queueTrigger(waypoint, direction)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
        }
      }

      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers()
      }

      this.oldScroll = {
        x: axes.horizontal.newScroll,
        y: axes.vertical.newScroll
      }
    }

    add (waypoint) {
      this.waypoints[waypoint.axis][waypoint.key] = waypoint
      this.refresh()
    }

    remove (waypoint) {
      delete this.waypoints[waypoint.axis][waypoint.key]

      var horizontalEmpty = isEmptyObject(this.waypoints.horizontal)
      var verticalEmpty = isEmptyObject(this.waypoints.vertical)

      if (horizontalEmpty && verticalEmpty && !this.dom.isWindow) {
        this.dom.off('.waypoints')
        delete contexts[this.key]
      }
    }

    destroy () {
      for (var axis in this.waypoints) {
        for (var waypointKey in this.waypoints[axis]) {
          this.waypoints[axis][waypointKey].destroy()
        }
      }
    }

    refresh () {
      this.handleScroll()

      var contextOffset = this.dom.offset() || { left: 0, top: 0 }
      var triggeredGroups = {}
      var axes = {
        horizontal: {
          contextOffset: contextOffset.left,
          contextScroll: this.dom.isWindow ? 0 : this.oldScroll.x,
          contextDimension: this.dom.innerWidth()
        },
        vertical: {
          contextOffset: contextOffset.top,
          contextScroll: this.dom.isWindow ? 0 : this.oldScroll.y,
          contextDimension: this.dom.innerHeight()
        }
      }

      for (var axisKey in axes) {
        var axis = axes[axisKey]
        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey]
          var direction = waypoint.refreshTriggerPoint({
            contextDimension: axis.contextDimension,
            contextAdjustment: axis.contextScroll - axis.contextOffset
          })

          if (direction) {
            waypoint.group.queueTrigger(waypoint, direction)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
        }
      }

      reqAnimationFrame(function() {
        for (var groupKey in triggeredGroups) {
          triggeredGroups[groupKey].flushTriggers()
        }
      })

      return this
    }

    static findOrCreateByElement (element) {
      return Context.findByElement(element) || new Context(element)
    }

    static findByElement (element) {
      return contexts[element.waypointContextKey]
    }

    static refreshAll () {
      for (var contextId in contexts) {
        contexts[contextId].refresh()
      }
    }
  }
}
