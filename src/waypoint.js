(function() {
  var keyCounter = 0
  var allWaypoints = {}

  var Waypoint = function(options) {
    if (!options) {
      throw new Error('No options passed to Waypoint constructor')
    }
    if (!options.element) {
      throw new Error('No element option passed to Waypoint constructor')
    }

    this.key = 'waypoint-' + keyCounter
    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options)
    this.element = this.options.element
    this.adapter = new Waypoint.Adapter(this.element)
    this.callback = options.handler
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
    this.enabled = this.options.enabled
    this.triggerPoint = null
    this.group = Waypoint.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    })
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)

    if (Waypoint.offsetAliases[this.options.offset]) {
      this.options.offset = Waypoint.offsetAliases[this.options.offset]
    }
    this.context.add(this)
    this.group.add(this)
    allWaypoints[this.key] = this
    keyCounter += 1
  }

  Waypoint.prototype.disable = function() {
    this.enabled = false
    return this
  }

  Waypoint.prototype.enable = function() {
    this.context.refresh()
    this.enabled = true
    return this
  }

  Waypoint.prototype.destroy = function() {
    this.context.remove(this)
    this.group.remove(this)
    delete allWaypoints[this.key]
  }

  /* Internal */
  Waypoint.prototype.trigger = function(args) {
    if (!this.enabled) {
      return
    }
    if (this.callback) {
      this.callback.apply(this, args)
    }
    if (this.options.triggerOnce) {
      this.destroy()
    }
  }

  /* Internal */
  Waypoint.prototype.queueTrigger = function(direction) {
    this.group.queueTrigger(this, direction)
  }

  Waypoint.adapters = []

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    group: 'default',
    horizontal: false,
    offset: 0,
    triggerOnce: false
  }

  Waypoint.offsetAliases = {
    'bottom-in-view': function() {
      return this.context.height() - this.adapter.outerHeight()
    },
    'right-in-view': function() {
      return this.context.adapter.width() - this.adapter.outerWidth()
    }
  }

  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  Waypoint.refresh = function() {
    Waypoint.Context.refreshAll()
  }

  Waypoint.destroyAll = function() {
    var allWaypointsArray = []
    for (var waypointKey in allWaypoints) {
      allWaypointsArray.push(allWaypoints[waypointKey])
    }
    for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
      allWaypointsArray[i].destroy()
    }
  }

  window.Waypoint = Waypoint
})()
