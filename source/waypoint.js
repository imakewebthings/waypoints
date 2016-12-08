module.exports = function (DOM, Context, Group) {
  var keyCounter = 0
  var allWaypoints = {}
  var axialDirections = {
    horizontal: {
      backward: 'left',
      forward: 'right'
    },
    vertical: {
      backward: 'up',
      forward: 'down'
    }
  }

  return class Waypoint {
    constructor (options) {
      if (!options) {
        throw new Error('No options passed to Waypoint constructor')
      }
      if (!options.element) {
        throw new Error('No element option passed to Waypoint constructor')
      }
      if (!options.handler) {
        throw new Error('No handler option passed to Waypoint constructor')
      }

      options = this.mergeOptions(options)
      this.key = `waypoint-${keyCounter}`
      this.element = options.element
      this.dom = new DOM(options.element)
      this.callback = options.handler
      this.axis = options.horizontal ? 'horizontal' : 'vertical'
      this.enabled = options.enabled
      this.continuous = options.continuous
      this.offset = options.offset
      this.triggerPoint = null
      this.group = Group.findOrCreate({
        name: options.group,
        axis: this.axis
      })
      this.context = Context.findOrCreateByElement(options.context)

      this.group.add(this)
      this.context.add(this)
      allWaypoints[this.key] = this
      keyCounter += 1
    }

    mergeOptions (options) {
      if (Waypoint.offsetAliases[options.offset]) {
        options.offset = Waypoint.offsetAliases[options.offset]
      }
      return {...Waypoint.defaults, ...options}
    }

    destroy () {
      this.context.remove(this)
      this.group.remove(this)
      delete allWaypoints[this.key]
    }

    disable () {
      this.enabled = false
      return this
    }

    enable () {
      this.context.refresh()
      this.enabled = true
      return this
    }

    next () {
      return this.group.next(this)
    }

    previous () {
      return this.group.previous(this)
    }

    trigger (direction) {
      if (this.enabled) {
        this.callback.call(this, direction)
      }
    }

    shouldScrollTrigger (oldScroll, newScroll) {
      if (this.triggerPoint === null) {
        return null
      }

      var wasBeforeTriggerPoint = oldScroll < this.triggerPoint
      var nowAfterTriggerPoint = newScroll >= this.triggerPoint

      if (wasBeforeTriggerPoint && nowAfterTriggerPoint) {
        return this.axialDirection('forward')
      } else if (!wasBeforeTriggerPoint && !nowAfterTriggerPoint) {
        return this.axialDirection('backward')
      }
    }

    refreshTriggerPoint ({ contextDimension, contextAdjustment }) {
      var elementOffset = 0
      var adjustment = this.offset
      var oldTriggerPoint = this.triggerPoint

      if (!this.dom.isWindow) {
        let offsetProp = this.axis === 'vertical' ? 'top' : 'left'
        elementOffset = this.dom.offset()[offsetProp]
      }

      if (typeof this.offset === 'function') {
        adjustment = this.offset.apply(this)
      } else if (typeof this.offset === 'string') {
        adjustment = parseFloat(adjustment)
        if (this.offset.indexOf('%') > - 1) {
          adjustment = Math.ceil(contextDimension * adjustment / 100)
        }
      }

      this.triggerPoint = Math.floor(elementOffset + contextAdjustment - adjustment)
      return this.shouldRefreshTrigger(oldTriggerPoint)
    }

    shouldRefreshTrigger(oldTriggerPoint) {
      var scrollProp = this.axis === 'vertical' ? 'y' : 'x'
      var contextScroll = this.context.oldScroll[scrollProp]
      var wasBeforeScroll = oldTriggerPoint < contextScroll
      var nowAfterScroll = this.triggerPoint >= contextScroll
      var triggeredBackward = wasBeforeScroll && nowAfterScroll
      var triggeredForward = !wasBeforeScroll && !nowAfterScroll
      var freshWaypoint = oldTriggerPoint === null

      if (!freshWaypoint && triggeredBackward) {
        return this.axialDirection('backward')
      } else if (!freshWaypoint && triggeredForward) {
        return this.axialDirection('forward')
      } else if (freshWaypoint && contextScroll >= this.triggerPoint) {
        return this.axialDirection('forward')
      }
    }

    axialDirection (direction) {
      return axialDirections[this.axis][direction]
    }

    static invokeAll (method) {
      for (var waypointKey in allWaypoints) {
        allWaypoints[waypointKey][method]()
      }
    }

    static destroyAll () {
      this.invokeAll('destroy')
    }

    static disableAll () {
      this.invokeAll('disable')
    }

    static enableAll () {
      Context.refreshAll()
      for (var waypointKey in allWaypoints) {
        allWaypoints[waypointKey].enabled = true
      }
    }

    static refreshAll () {
      Context.refreshAll()
    }

    static viewportHeight () {
      return (new DOM(window)).innerHeight()
    }

    static viewportWidth () {
      return (new DOM(window)).innerWidth()
    }

    static get defaults () {
      return {
        context: window,
        continuous: true,
        enabled: true,
        group: 'default',
        horizontal: false,
        offset: 0
      }
    }

    static get offsetAliases () {
      return {
        'bottom-in-view': function () {
          return this.context.dom.innerHeight() - this.dom.outerHeight()
        },
        'right-in-view': function () {
          return this.context.dom.innerWidth() - this.dom.outerWidth()
        }
      }
    }
  }
}
