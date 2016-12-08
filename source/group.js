module.exports = function () {
  function byTriggerPoint (a, b) {
    return a.triggerPoint - b.triggerPoint
  }

  function byReverseTriggerPoint(a, b) {
    return b.triggerPoint - a.triggerPoint
  }

  var groups = {
    vertical: {},
    horizontal: {}
  }

  return class Group {
    constructor ({ axis, name }) {
      this.name = name
      this.axis = axis
      this.id = `${name}-${axis}`
      this.waypoints = []
      this.clearTriggerQueues()
      groups[axis][name] = this
    }

    add (waypoint) {
      this.waypoints.push(waypoint)
    }

    remove (waypoint) {
      var index = this.waypoints.indexOf(waypoint)
      if (index > -1) {
        this.waypoints.splice(index, 1)
      }
    }

    clearTriggerQueues () {
      this.triggerQueues = {
        up: [],
        down: [],
        left: [],
        right: []
      }
    }

    queueTrigger (waypoint, direction) {
      this.triggerQueues[direction].push(waypoint)
    }

    flushTriggers () {
      for (var direction in this.triggerQueues) {
        let waypoints = this.triggerQueues[direction]
        let reverse = direction === 'up' || direction === 'left'
        waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
        waypoints.forEach(function (waypoint, i) {
          if (waypoint.continuous || i === waypoints.length - 1) {
            waypoint.trigger(direction)
          }
        })
      }
      this.clearTriggerQueues()
    }

    next (waypoint) {
      this.waypoints.sort(byTriggerPoint)
      var index = this.waypoints.indexOf(waypoint)
      if (index === -1 || index === this.waypoints.length - 1) {
        return null
      }
      return this.waypoints[index + 1]
    }

    previous (waypoint) {
      this.waypoints.sort(byTriggerPoint)
      var index = this.waypoints.indexOf(waypoint)
      if (index === -1 || !index) {
        return null
      }
      return this.waypoints[index - 1]
    }

    first () {
      this.waypoints.sort(byTriggerPoint)
      return this.waypoints[0]
    }

    last () {
      this.waypoints.sort(byTriggerPoint)
      return this.waypoints[this.waypoints.length - 1]
    }

    static findOrCreate (options) {
      return groups[options.axis][options.name] || new Group(options)
    }
  }
}
