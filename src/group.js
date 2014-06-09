(function() {
  function byTriggerPoint(a, b) {
    return a.triggerPoint - b.triggerPoint
  }

  function byReverseTriggerPoint(a, b) {
    return b.triggerPoint - a.triggerPoint
  }

  var groups = {
    vertical: {},
    horizontal: {}
  }

  var Group = function(options) {
    this.name = options.name
    this.axis = options.axis
    this.id = this.name + '-' + this.axis
    this.waypoints = []
    this.clearTriggerQueues()
    groups[this.axis][this.name] = this
  }

  Group.prototype.previous = function(waypoint) {
    this.sort()
    var index = $.inArray(waypoint, this.waypoints)
    return index ? this.waypoints[index - 1] : null
  }

  Group.prototype.next = function(waypoint) {
    this.sort()
    var index = $.inArray(waypoint, this.waypoints)
    var isLast = index === this.waypoints.length - 1
    return isLast ? null : this.waypoints[index + 1]
  }

  Group.prototype.first = function() {
    return this.waypoints[0]
  }

  Group.prototype.last = function() {
    return this.waypoints[this.waypoints.length - 1]
  }

  /* Internal */
  Group.prototype.add = function(waypoint) {
    this.waypoints.push(waypoint)
  }

  /* Internal */
  Group.prototype.remove = function(waypoint) {
    this.waypoints.splice($.inArray(waypoint), 1)
  }

  /* Internal */
  Group.prototype.sort = function() {
    this.waypoints.sort(function(a, b) {
      return a.triggerPoint - b.triggerPoint
    })
  }

  /* Internal */
  Group.prototype.clearTriggerQueues = function() {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    }
  }

  /* Internal */
  Group.prototype.queueTrigger = function(waypoint, direction) {
    this.triggerQueues[direction].push(waypoint)
  }

  /* Internal */
  Group.prototype.flushTriggers = function() {
    $.each(this.triggerQueues, function(direction, waypoints) {
      var reverse = direction === 'up' || direction === 'left'
      waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
      $.each(waypoints, function(i, waypoint) {
        if (waypoint.options.continuous || i === waypoints.length - 1) {
          waypoint.trigger([direction])
        }
      })
    })
    this.clearTriggerQueues()
  }

  /* Internal */
  Group.findOrCreate = function(options) {
    return groups[options.axis][options.name] || new Group(options)
  }

  window.Waypoint.Group = Group
})()
