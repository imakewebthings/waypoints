/*!
Waypoints Inview Shortcut Timer based - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
(function () {
	'use strict'
	var Waypoint = window.Waypoint

	function InviewTimer(options) {
		this.options = Waypoint.Adapter.extend({}, InviewTimer.defaults, options)
		this.options.ratio = parseFloat(/(\d+)\%/.exec(this.options.offset)[1]) / 100
		this.waypoints = []
		this.timerVertical = null
		this.timerHorizontal = null
		this.timerVerticalDone = false
		this.timerHorizontalDone = false
		this.createWaypoints()
	}
	var noop = function () {}
	InviewTimer.prototype.createWaypoints = function () {
		var r = this.options.ratio
		var rI = 1 - r

		function addLog(command, direction, wp, extra) {
			var d = new Date().toISOString().split('T')[1]
			d += ' ' + wp.options.debug
			d += ' ' + command
			d += ' ' + direction
			d += ' ' + wp.axis
			d += ' page=' + wp.context.innerHeight() + 'X' + wp.context.innerWidth()
			d += ' div=' + wp.adapter.outerHeight() + 'X' + wp.adapter.outerWidth()
			d += ' triggerPoint=' + wp.triggerPoint
			d += ' cur_offset=' + wp.options.offset.call(wp) + ' with ' + wp.options.o
			if (extra !== undefined && extra !== '') d += extra
			console.log(d)
		}

		function timeoutDone(c, o, wp, direction) {
			if (c.isHorizontal) {
				o.timerHorizontalDone = true
			} else {
				o.timerVerticalDone = true
			}
			var shouldBeCalled = o.timerVerticalDone === true && o.timerHorizontalDone === true
			addLog('done ', direction, wp, shouldBeCalled ? ' trigger' : '')
			if (shouldBeCalled) {
				o.options.callback(o.options)
				if (o.options.destroyOnValid) {
					o.destroy()
				} else if (c.isHorizontal) {
					o.timerHorizontal = null
				} else {
					o.timerVertical = null
				}
			}
		}

		function enter(c, o, direction, wp) {
			var timer = c.isHorizontal ? o.timerHorizontal : o.timerVertical
			addLog('enter', direction, wp, timer !== null ? ' already entered' : '')
			if (timer !== null) {
				return
			}
			timer = window.setTimeout(function () {
				timeoutDone(c, o, wp, direction)
			}, o.options.timeout)
			if (c.isHorizontal) {
				o.timerHorizontal = timer
			} else {
				o.timerVertical = timer
			}
		}

		function exit(c, o, direction, wp) {
			var timer = c.isHorizontal ? o.timerHorizontal : o.timerVertical
			addLog('exit ', direction, wp, timer === null ? ' no prior enter' : '')
			if (timer === null) {
				return
			}
			clearTimeout(timer)
			if (c.isHorizontal) {
				o.timerHorizontalDone = false
				o.timerHorizontal = null
			} else {
				o.timerVerticalDone = false
				o.timerVertical = null
			}
		}

		function top() {
			return -1 * Math.round(this.adapter.outerHeight() * rI)  - 1
		}

		function bottom() {
			return Math.round(this.context.innerHeight() - this.adapter.outerHeight() * r)  + 1
		}

		function left() {
			return -1 * Math.round(this.adapter.outerWidth() * rI) - 1
		}

		function right() {
			return Math.round(this.context.innerWidth() - this.adapter.outerWidth() * r) + 1
		}
		var configs = {
			vertical: [{
				up: exit,
				down: enter,
				offset: bottom,
				o: 'bottom'
			}, {
				up: enter,
				down: exit,
				offset: top,
				o: 'top'
			}],
			horizontal: [{
				left: exit,
				right: enter,
				offset: right,
				o: 'right'
			}, {
				left: enter,
				right: exit,
				offset: left,
				o: 'left'
			}]
		}
		this.generateWaypoints(configs.vertical, false)
		this.generateWaypoints(configs.horizontal, true)
	}
	InviewTimer.prototype.generateWaypoints = function (configs, isHorizontal) {
		for (var i = 0; i < configs.length; i++) {
			this.createWaypoint(Waypoint.Adapter.extend({}, {
				isHorizontal: isHorizontal,
				debug: this.options.debug
			}, configs[i]))
		}
	}
	InviewTimer.prototype.createWaypoint = function (config) {
		this.waypoints.push(new Waypoint({
			element: this.options.element,
			handler: (function (config, o) {
				return function (direction) {
					config[direction](config, o, direction, this)
				}
			}(config, this)),
			offset: config.offset,
			horizontal: config.isHorizontal,
			debug: config.debug,
			o: config.o
		}))
	}
	InviewTimer.prototype.destroy = function () {
		for (var i = 0, end = this.waypoints.length; i < end; i++) {
			this.waypoints[i].destroy()
		}
		this.waypoints = []
	}
	InviewTimer.defaults = {
		timeout: 100,
		offset: '80%',
		callback: noop,
		destroyOnValid: true
	}
	Waypoint.InviewTimer = InviewTimer
}());