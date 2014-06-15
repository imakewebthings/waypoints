describe('Waypoints Inview Shortcut', function() {
  var standard = 50
  var $scroller = $(window)
  var $target, waypoint, hits

  function setsTrue(key) {
    return function() {
      hits[key] = true
    }
  }

  function setsEnter() {
    hits.enter = true
  }

  function setsEntered() {
    hits.entered = true
  }

  function setsExit() {
    hits.exit = true
  }

  function setsExited() {
    hits.exited = true
  }

  function toBeTrue(key) {
    return function() {
      return hits[key]
    }
  }

  beforeEach(function() {
    loadFixtures('standard.html')
    $target = $('#near2')
    hits = {}
    waypoint = new Waypoint.Inview({
      element: $target[0],
      enter: setsTrue('enter'),
      entered: setsTrue('entered'),
      exit: setsTrue('exit'),
      exited: setsTrue('exited')
    })
  })

  afterEach(function() {
    waypoint.destroy()
    $scroller.scrollTop(0).scrollLeft(0)
    waits(standard)
  })

  describe('vertical', function() {

    describe('enter callback', function() {
      it('triggers when element starts entering from below', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top - Waypoint.viewportHeight())
        })
        waitsFor(toBeTrue('enter'), 'enter to trigger')
      })

      it('triggers when element starts entering from above', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top + $target.outerHeight())
        })
        waits(standard)
        runs(function() {
          hits.enter = false
          $scroller.scrollTop($scroller.scrollTop() - 1)
        })
        waitsFor(toBeTrue('enter'), 'enter to trigger')
      })
    })

    describe('entered callback', function() {
      it('triggers when element finishes entering from below', function() {
        runs(function() {
          var top = $target.offset().top
          var viewportHeight = Waypoint.viewportHeight()
          var elementHeight = $target.outerHeight()
          $scroller.scrollTop(top - viewportHeight + elementHeight)
        })
        waitsFor(toBeTrue('entered'), 'entered to trigger')
      })

      it('triggers when element finishes entering from above', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top)
        })
        waits(standard)
        runs(function() {
          hits.entered = false
          $scroller.scrollTop($scroller.scrollTop() - 1)
        })
        waitsFor(toBeTrue('entered'), 'entered to trigger')
      })
    })

    xdescribe('exit callback', function() {
      it('triggers when element starts leaving below', function() {
        runs(function() {
          var top = $target.offset().top
          var viewportHeight = Waypoint.viewportHeight()
          var elementHeight = $target.outerHeight()
          $scroller.scrollTop(top - viewportHeight + elementHeight)
        })
        waits(standard)
        runs(function() {
          expect(hits.exit).toBeFalsy()
          $scroller.scrollTop($scroller.scrollTop() - 1)
        })
        waitsFor(toBeTrue('exit'), 'exit to trigger')
      })

      xit('triggers when element starts leaving above', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top)
        })
        waitsFor(toBeTrue('exit'), 'exit to trigger')
      })
    })

    describe('exited callback', function() {
      it('triggers when element finishes exiting below', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top - Waypoint.viewportHeight())
        })
        waits(standard)
        runs(function() {
          $scroller.scrollTop($scroller.scrollTop() - 1)
        })
        waitsFor(toBeTrue('exited'), 'exited to trigger')
      })

      it('triggers when element finishes exiting above', function() {
        runs(function() {
          $scroller.scrollTop($target.offset().top + $target.outerHeight())
        })
        waitsFor(toBeTrue('exited'), 'exited to trigger')
      })
    })
  })
})
