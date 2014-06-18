jQuery.each(Waypoint.adapters, function(i, adapter) {
  describe(adapter.name + ' adapter:', function() {
    describe('Waypoint.Group', function() {
      var $ = jQuery
      var standard = 50
      var currentDirection, firstWaypoint, secondWaypoint, customGroupWaypoint
      var defaultGroup, customGroup

      function setDirection(direction) {
        currentDirection = direction
      }

      function hasDirection() {
        return currentDirection != null
      }

      beforeEach(function() {
        Waypoint.Adapter = adapter.Adapter
        loadFixtures('standard.html')
        currentDirection = null
        firstWaypoint = new Waypoint({
          element: $('#same1')[0],
          handler: setDirection
        })
        secondWaypoint = new Waypoint({
          element: $('#near1')[0],
          handler: setDirection
        })
        customGroupWaypoint = new Waypoint({
          element: $('#same2')[0],
          handler: setDirection,
          group: 'custom'
        })
        defaultGroup = firstWaypoint.group
        customGroup = customGroupWaypoint.group
      })

      afterEach(function() {
        firstWaypoint.destroy()
        secondWaypoint.destroy()
        customGroupWaypoint.destroy()
        waits(standard)
      })

      describe('#previous(waypoint)', function() {
        it('returns previous waypoint based on trigger point', function() {
          expect(defaultGroup.previous(secondWaypoint)).toEqual(firstWaypoint)
        })

        it('returns null if on the first waypoint in the group', function() {
          expect(defaultGroup.previous(firstWaypoint)).toBeNull()
        })
      })

      describe('#next(waypoint)', function() {
        it('returns next waypoint based on trigger point', function() {
          expect(defaultGroup.next(firstWaypoint)).toEqual(secondWaypoint)
        })

        it('returns null if on the last waypoint in the group', function() {
          expect(defaultGroup.next(secondWaypoint)).toBeNull()
        })
      })

      describe('#first()', function() {
        it('returns the first waypoint based on trigger point', function() {
          expect(defaultGroup.first()).toEqual(firstWaypoint)
        })
      })

      describe('#last()', function() {
        it('returns the first waypoint based on trigger point', function() {
          expect(defaultGroup.last()).toEqual(secondWaypoint)
        })
      })
    })
  })
})
