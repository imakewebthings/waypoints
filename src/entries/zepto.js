'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var ZeptoAdapter = require('../adapters/zepto')
var Inview = require('../shortcuts/inview')
var Infinite = require('../shortcuts/infinite')
var Sticky = require('../shortcuts/sticky')

global.Waypoint = Waypoint
Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(ZeptoAdapter)
Waypoint.Adapter = ZeptoAdapter.Adapter
if (global.Zepto) {
    global.Zepto.fn.waypoint = createExtension(global.Zepto)
}

Waypoint.Inview = Inview
Waypoint.Infinite = Infinite
Waypoint.Sticky = Sticky

module.exports = Waypoint
