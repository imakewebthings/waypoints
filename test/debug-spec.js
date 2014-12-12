'use strict'

/* global
 * describe, it, beforeEach, afterEach, expect, spyOn, waits, runs,
 * waitsFor, loadFixtures, Waypoint
 */

describe('Waypoints debug script', function() {
  var waypoint, element

  beforeEach(function() {
    loadFixtures('standard.html')
  })

  afterEach(function() {
    waypoint.destroy()
  })

  describe('display none detection', function() {
    beforeEach(function() {
      element = document.getElementById('same1')
      waypoint = new Waypoint({
        element: element,
        handler: function() {}
      })
      element.style.display = 'none'
    })

    it('logs a console error', function() {
      spyOn(console, 'error')
      waypoint.context.refresh()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('display fixed positioning detection', function() {
    beforeEach(function() {
      element = document.getElementById('same1')
      waypoint = new Waypoint({
        element: element,
        handler: function() {}
      })
      element.style.position = 'fixed'
    })

    it('logs a console error', function() {
      spyOn(console, 'error')
      waypoint.context.refresh()
      expect(console.error).toHaveBeenCalled()
    })
  })


  describe('fixed position detection', function() {

  })
})
