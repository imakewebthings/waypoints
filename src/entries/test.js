'use strict'
var Waypoint = require('../waypoint')
var Context = require('../context')
var Group = require('../group')
var JQueryAdapter = require('../adapters/jquery')
var ZeptoAdapter = require('../adapters/zepto')
var NoFrameworkAdapter = require('../adapters/noframework')
var Inview = require('../shortcuts/inview')
var Infinite = require('../shortcuts/infinite')
var Sticky = require('../shortcuts/sticky')
var Debug = require('../debug')
var createExtension = require('../adapters/jquery-zepto-fn-extension')

Waypoint.Context = Context
Waypoint.Group = Group
Waypoint.adapters.push(JQueryAdapter)
Waypoint.adapters.push(ZeptoAdapter)
if (global.jQuery) {
    global.jQuery.fn.waypoint = createExtension(global.jQuery)
}
if (global.Zepto) {
    global.Zepto.fn.waypoint = createExtension(global.Zepto)
}
Waypoint.adapters.push(NoFrameworkAdapter)
Waypoint.Adapter = JQueryAdapter.Adapter
Waypoint.Inview = Inview
Waypoint.Infinite = Infinite
Waypoint.Sticky = Sticky
global.Waypoint = Waypoint // debux expects global Waypoint
Debug()
module.exports = Waypoint
