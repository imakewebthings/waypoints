'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var NoFrameworkAdapter = require('../adapters/noframework')
var Inview = require('../shortcuts/inview')

Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(NoFrameworkAdapter)
Waypoint.Adapter = NoFrameworkAdapter.Adapter
Waypoint.Inview = Inview

module.exports = Waypoint
