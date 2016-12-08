var DOM = require('./dom')()
var Context = require('./context')(DOM)
var Group = require('./group')()
var Waypoint = require('./waypoint')(DOM, Context, Group)
var oldWindowLoad = window.onload

Context.findOrCreateByElement(window)

window.onload = function () {
  if (oldWindowLoad) {
    oldWindowLoad()
  }
  Context.refreshAll()
}

window.Waypoint = Waypoint
module.exports = Waypoint
