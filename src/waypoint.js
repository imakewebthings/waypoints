(function() {
  var keyCounter = 0

  var Waypoint = function(options) {
    if (!options) {
      throw new Error('No options passed to Waypoint constructor')
    }
    if (!options.element) {
      throw new Error('No element option passed to Waypoint constructor')
    }

    this.key = keyCounter
    this.options = $.extend({}, Waypoint.defaults, options)
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)
    this.context.add(this)
    this.callback = options.handler
    this.element = this.options.element
    this.$element = $(this.element)
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
    this.enabled = this.options.enabled
    this.triggerPoint = null

    keyCounter += 1
  }

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

  Waypoint.prototype.disable = function() {
    this.enabled = false
  }

  Waypoint.prototype.enable = function() {
    this.context.refresh()
    this.enabled = true
  }

  Waypoint.prototype.destroy = function() {
    this.context.remove(this)
    this.context.checkEmpty()
  }

  Waypoint.prototype.canTriggerOnRefresh = function() {
    return (!this.options.onlyOnScroll || this.offset == null) && this.enabled
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

  Waypoint.isTouch = 'ontouchstart' in window

  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  window.Waypoint = Waypoint
})()
