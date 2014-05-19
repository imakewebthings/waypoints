describe('Waypoint', function() {
  var standard = 50
  var hit, $scroller, target, returnValue, $target

  beforeEach(function() {
    loadFixtures('standard.html')
    $scroller = $(window)
    hit = false
  })

  afterEach(function() {
    $scroller.scrollTop(0).scrollLeft()
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
      returnValue = new Waypoint({
        element: document.getElementById('same1')
      })
      expect(returnValue instanceof Waypoint).toBeTruthy()
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
      new Waypoint({
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
})
