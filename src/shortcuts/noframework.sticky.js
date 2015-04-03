/*!
Waypoints Sticky Element Shortcut - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
(function() {
  'use strict'

  var Waypoint = window.Waypoint

  /* http://imakewebthings.com/waypoints/shortcuts/sticky-elements */
  function Sticky(options) {
    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, Sticky.defaults, options)
    this.element = this.options.element
    this.adapter = new Waypoint.Adapter(this.element)
    this.createWrapper()
    this.createWaypoint()
  }

  /* Private */
  Sticky.prototype.createWaypoint = function() {
    var originalHandler = this.options.handler

    this.waypoint = new Waypoint(Waypoint.Adapter.extend({}, this.options, {
      element: this.wrapper,
      handler: Sticky.proxy(function(direction) {
        var shouldBeStuck = this.options.direction.indexOf(direction) > -1
        var wrapperHeight = shouldBeStuck ? this.adapter.outerHeight() + 'px' : ''

        this.wrapper.style.height = wrapperHeight
        Sticky.toggleClassName(this.element, this.options.stuckClass, shouldBeStuck)

        if (originalHandler) {
          originalHandler.call(this, direction)
        }
      }, this)
    }))
  }

  /* Private */
  Sticky.prototype.createWrapper = function() {
    if (this.options.wrapper) {
      this.element.insertAdjacentHTML('beforebegin', this.options.wrapper)
      this.wrapper = this.element.previousSibling
      this.element.parentNode.removeChild(this.element)
      this.wrapper.appendChild(this.element)
    } else {
      this.wrapper = this.element.parentNode
    }
  }

  /* Public */
  Sticky.prototype.destroy = function() {
    if (this.element.parentNode === this.wrapper) {
      this.waypoint.destroy()
      Sticky.removeClassName(this.element, this.options.stuckClass)

      var parent = this.wrapper.parentNode
      while (this.wrapper.firstChild) {
        parent.insertBefore(this.wrapper.firstChild, this.wrapper)
      }
      parent.removeChild(this.wrapper)
    }
  }

  Sticky.proxy = function(func, obj) {
    return function() {
      return func.apply(obj, arguments)
    }
  }

  /* Methods to work with classes from prototype.js */
  Sticky.hasClassName = function(element, className) {
    var elementClassName = element.className
    if (elementClassName.length === 0) {
      return false
    }
    if (elementClassName === className) {
      return true
    }
    var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)")
    return re.test(elementClassName)
  }

  Sticky.addClassName = function(element, className) {
    if (!Sticky.hasClassName(element, className)) {
      element.className += (element.className ? ' ' : '') + className
    }
  }

  Sticky.removeClassName = function(element, className) {
    var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)")
    element.className = element.className.replace(re, ' ').strip()
  }

  Sticky.toggleClassName = function(element, className, bool) {
    if (undefined === bool) {
      bool = Sticky.hasClassName(element, className)
    }
    var method = Sticky[bool ? 'addClassName' : 'removeClassName']
    method(element, className)
  }

  Sticky.defaults = {
    wrapper: '<div class="sticky-wrapper" />',
    stuckClass: 'stuck',
    direction: 'down right'
  }

  Waypoint.Sticky = Sticky
}())
;