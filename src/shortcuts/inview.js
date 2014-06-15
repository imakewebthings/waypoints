(function() {
  function noop() {}

  var Inview = function(options) {
    this.options = window.Waypoint.Adapter.extend({}, Inview.defaults, options)
    this.waypoints = []
    this.createWaypoints()
  }

  Inview.prototype.destroy = function() {
    for (var i = 0, end = this.waypoints.length; i < end; i++) {
      this.waypoints[i].destroy()
    }
    this.waypoints = []
  }

  /* Internal */
  Inview.prototype.createWaypoints = function() {
    var self = this
    var configs = [{
      down: 'enter',
      up: 'exited',
      offset: '100%'
    }, {
      down: 'entered',
      up: 'exit',
      offset: 'bottom-in-view'
    }, {
      down: 'exit',
      up: 'entered',
      offset: 0
    }, {
      down: 'exited',
      up: 'enter',
      offset: function() {
        return -this.adapter.outerHeight()
      }
    }]

    for (var i = 0, end = configs.length; i < end; i++) {
      var config = configs[i]
      this.waypoints.push(new Waypoint({
        element: this.options.element,
        handler: (function(config) {
          return function(direction) {
            self.options[config[direction]].call(this, direction)
          }
        })(config),
        offset: config.offset
      }))
    }
  }

  Inview.defaults = {
    enter: noop,
    entered: noop,
    exit: noop,
    exited: noop
  }

  window.Waypoint.Inview = Inview
})()
