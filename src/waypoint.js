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
    this.options = $.extend({}, Waypoint.defaults, options)
    this.element = this.options.element
    this.$element = $(this.element)
    this.callback = options.handler
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
    this.enabled = this.options.enabled
    this.triggerPoint = null
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)

    if (Waypoint.offsetAliases[this.options.offset]) {
      this.options.offset = Waypoint.offsetAliases[this.options.offset]
    }
    this.context.add(this)
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
      this.callback.apply(this.element, args)
    }
    if (this.options.triggerOnce) {
      this.destroy()
    }
  }

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    horizontal: false,
    offset: 0,
    triggerOnce: false
  }

  Waypoint.settings = {
    scrollThrottle: 30,
    resizeThrottle: 100
  }

  Waypoint.offsetAliases = {
    'bottom-in-view': function() {
      return this.context.height() - this.$element.outerHeight()
    }
  }

  Waypoint.isTouch = 'ontouchstart' in window

  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  Waypoint.refresh = function() {
    Waypoint.Context.refreshAll()
  }

  window.Waypoint = Waypoint
})()
