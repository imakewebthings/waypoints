  'use strict'
  var displayNoneMessage = [
    'You have a Waypoint element with display none. For more information on ',
    'why this is a bad idea read ',
    'http://imakewebthings.com/waypoints/guides/debugging/#display-none'
  ].join('')
  var fixedMessage = [
    'You have a Waypoint element with fixed positioning. For more ',
    'information on why this is a bad idea read ',
    'http://imakewebthings.com/waypoints/guides/debugging/#fixed-position'
  ].join('')

  function checkWaypointStyles() {
    var originalRefresh = global.Waypoint.Context.prototype.refresh

    global.Waypoint.Context.prototype.refresh = function() {
      for (var axis in this.waypoints) {
        for (var key in this.waypoints[axis]) {
          var waypoint = this.waypoints[axis][key]
          var style = global.getComputedStyle(waypoint.element)
          if (!waypoint.enabled) {
            continue
          }
          if (style && style.display === 'none') {
            console.error(displayNoneMessage)
          }
          if (style && style.position === 'fixed') {
            console.error(fixedMessage)
          }
        }
      }
      return originalRefresh.call(this)
    }
  }

  module.exports = checkWaypointStyles
