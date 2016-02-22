'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var ZeptoAdapter = require('../adapters/zepto')
var Inview = require('../shortcuts/inview')
var Infinite = require('../shortcuts/infinite')
var Sticky = require('../shortcuts/sticky')

Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(ZeptoAdapter)
Waypoint.Adapter = ZeptoAdapter.Adapter
Waypoint.Inview = Inview
Waypoint.Infinite = Infinite
Waypoint.Sticky = Sticky

module.exports = Waypoint
