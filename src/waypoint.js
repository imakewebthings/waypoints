(function() {
  var keyCounter = 0

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
  }

  /* Internal */
  Waypoint.prototype.canTriggerOnRefresh = function() {
    return !this.options.onlyOnScroll || this.triggerPoint == null
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
    }
  }

  Waypoint.settings = {
    scrollThrottle: 30,
    resizeThrottle: 100
  }

  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  Waypoint.refresh = function() {
    Waypoint.Context.refreshAll()
  }

  window.Waypoint = Waypoint
})()
