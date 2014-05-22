describe('Waypoint', function() {
  var standard = 50
  var hit, $scroller, waypoint, $target, returnValue

  function setHitTrue() {
    hit = true
  }

  function hitToBeTrue() {
    return hit
  }

  beforeEach(function() {
    loadFixtures('standard.html')
    $scroller = $(window)
    hit = false
    waypoint = null
  })

  afterEach(function() {
    if (waypoint && waypoint.destroy) {
      waypoint.destroy()
    }
    $scroller.scrollTop(0).scrollLeft(0)
    waits(standard)
  })

  describe('new Waypoint()', function() {
    it('errors out', function() {
      expect(function() {
        new Waypoint()
      }).toThrow()
    })
  })

  describe('new Waypoint(options)', function() {
    it('returns an instance of the Waypoint class', function() {
      waypoint = new Waypoint({
        element: document.getElementById('same1')
      })
      expect(waypoint instanceof Waypoint).toBeTruthy()
    })

    it('requires the element option', function() {
      expect(function() {
        new Waypoint({})
      }).toThrow()
    })
  })

  describe('handler option', function() {
    var currentDirection

    beforeEach(function() {
      $target = $('#same1')
      currentDirection = null
      waypoint = new Waypoint({
        element: $target[0],
        handler: function(direction) {
          currentDirection = direction
        }
      })
    })

    it('triggers with direction parameter', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return currentDirection === 'down'
      }, 'down to trigger')
      runs(function() {
        $scroller.scrollTop($target.offset().top - 1)
      })
      waitsFor(function() {
        return currentDirection === 'up'
      }, 'up to trigger')
    })
  })

  describe('offset option', function() {
    beforeEach(function() {
      $target = $('#same1')
    })

    it('takes a px offset', function(){
      runs(function() {
        waypoint = new Waypoint({
          element: $target[0],
          handler: setHitTrue,
          offset: 50
        })
        $scroller.scrollTop($target.offset().top - 51)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top - 50)
      })
      waitsFor(hitToBeTrue, 'callback to trigger')
    })

    it('takes a % offset', function() {
      var trigger = $target.offset().top - Waypoint.viewportHeight() * .37
      runs(function() {
        waypoint = new Waypoint({
          element: $target[0],
          handler: setHitTrue,
          offset: '37%'
        })
        $scroller.scrollTop(trigger - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(trigger)
      })
      waitsFor(hitToBeTrue, 'callback to trigger')
    })

    it('takes a function offset', function() {
      runs(function() {
        waypoint = new Waypoint({
          element: $target[0],
          handler: setHitTrue,
          offset: function() {
            return -this.$element.height()
          }
        })
        $scroller.scrollTop($target.offset().top + $target.height() - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top + $target.height())
      })
      waitsFor(hitToBeTrue, 'callback to trigger')
    })

    it('takes a botton-in-view function alias', function() {
      var top = $target.offset().top
      var height = $target.outerHeight()
      var windowHeight = Waypoint.viewportHeight()
      var inview = top + height - windowHeight
      runs(function() {
        waypoint = new Waypoint({
          element: $target[0],
          handler: setHitTrue,
          offset: 'bottom-in-view'
        })
        $scroller.scrollTop(inview - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(inview)
      })
      waitsFor(hitToBeTrue, 'callback to trigger')
    })
  })

  describe('triggerOnce option', function() {
    it('destroys the waypoint after first trigger', function() {
      runs(function() {
        $target = $('#same1')
        waypoint = new Waypoint({
          element: $target[0],
          triggerOnce: true
        })
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return !waypoint.context.waypoints.vertical[waypoint.key]
      }, 'waypoint to be destroyed')
    })
  })

  describe('context option', function() {
    it('needs specs', function() {
      expect('implemented').toBeFalsy()
    })
  })

  describe('#disable()', function() {
    beforeEach(function() {
      $target = $('#same1')
      waypoint = new Waypoint({
        element: $target[0],
        handler: setHitTrue
      })
      returnValue = waypoint.disable()
    })

    it('returns the same waypoint object for chaining', function() {
      expect(returnValue).toEqual(waypoint)
    })

    it('disables callback triggers', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
      })
    })
  })

  describe('#enable()', function() {
    beforeEach(function() {
      $target = $('#same1')
      waypoint = new Waypoint({
        element: $target[0],
        handler: setHitTrue
      })
      waypoint.disable()
      returnValue = waypoint.enable()
    })

    it('returns the same waypoint instance for chaining', function() {
      expect(returnValue).toEqual(waypoint)
    })

    it('enables callback triggers', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(hitToBeTrue, 'callback to trigger')
    })
  })

  describe('#destroy()', function() {
    beforeEach(function() {
      $target = $('#same1')
      waypoint = new Waypoint({
        element: $target[0],
        handler: setHitTrue
      })
      returnValue = waypoint.destroy()
    })

    it('returns undefined', function() {
      expect(returnValue).toBeUndefined()
    })

    it('no longer triggers callbacks', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
      })
    })
  })

  describe('Waypoint.viewportHeight()', function() {
    it('returns window innerHeight if it exists', function() {
      var height = Waypoint.viewportHeight()
      if (window.innerHeight) {
        expect(height).toEqual(window.innerHeight)
      }
      else {
        expect(height).toEqual(document.documentElement.clientHeight)
      }
    })
  })
})
