'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var JQueryAdapter = require('../adapters/jquery')
var Inview = require('../shortcuts/inview')
var Infinite = require('../shortcuts/infinite')
var Sticky = require('../shortcuts/sticky')
var createExtension = require('../adapters/jquery-zepto-fn-extension')

global.Waypoint = Waypoint

Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(JQueryAdapter)
Waypoint.Adapter = JQueryAdapter.Adapter
if (global.jQuery) {
    global.jQuery.fn.waypoint = createExtension(global.jQuery)
}

Waypoint.Inview = Inview
Waypoint.Infinite = Infinite
Waypoint.Sticky = Sticky

module.exports = Waypoint
