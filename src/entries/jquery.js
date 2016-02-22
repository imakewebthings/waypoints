'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var JQueryAdapter = require('../adapters/jquery')
var Inview = require('../shortcuts/inview')
var Infinite = require('../shortcuts/infinite')
var Sticky = require('../shortcuts/sticky')

Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(JQueryAdapter)
Waypoint.Adapter = JQueryAdapter.Adapter
Waypoint.Inview = Inview
Waypoint.Infinite = Infinite
Waypoint.Sticky = Sticky

module.exports = Waypoint
