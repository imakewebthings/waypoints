describe('jQuery Waypoints', function() {
  var standard = 50
  var hit, $scroller, $target, $return = null

  function setHitTrue() {
    hit = true
  }

  beforeEach(function() {
    loadFixtures('standard.html')
    $scroller = $(window)
    hit = false
  })

  afterEach(function() {
    $.waypoints('destroy')
    $scroller.scrollTop(0).scrollLeft(0)
    waits(standard)
  })

  describe('#waypoint()', function() {
    it ('errors out', function() {
      expect(function() {
        $('#same1').waypoint()
      }).toThrow()
    })
  })

  describe('#waypoint(callback)', function() {
    var currentDirection

    beforeEach(function() {
      currentDirection = null
      $target = $('#same1').waypoint(function(direction) {
        currentDirection = direction
        hit = true
      })
    })

    it('creates a waypoint', function() {
      expect($.waypoints().vertical.length).toEqual(1)
    })

    it('triggers the callback', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('uses the default offset', function(done) {
      runs(function() {
        $scroller.scrollTop($target.offset().top - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('passes correct directions', function() {
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

  describe('#waypoint(options)', function() {
    beforeEach(function() {
      $target = $('#same1')
    })

    it('creates a waypoint', function() {
      $target.waypoint({ triggerOnce: true })
      expect($.waypoints().vertical.length).toEqual(1)
    })

    it('respects a px offset', function() {
      runs(function() {
        $target.waypoint({
          offset: 50,
          handler: setHitTrue
        })
        $scroller.scrollTop($target.offset().top - 51)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top - 50)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects a % offset', function() {
      var trigger = $target.offset().top - $.waypoints('viewportHeight') * .37
      runs(function() {
        $target.waypoint({
          offset: '37%',
          handler: setHitTrue
        })
        $scroller.scrollTop(trigger - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(trigger)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects a function offset', function() {
      runs(function() {
        $target.waypoint({
          offset: function() {
            return -$(this).height()
          },
          handler: setHitTrue
        })
        $scroller.scrollTop($target.offset().top + $target.height() - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top + $target.height())
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects the botton-in-view function alias', function() {
      var top = $target.offset().top
      var height = $target.outerHeight()
      var windowHeight = $.waypoints('viewportHeight')
      var inview = top + height - windowHeight
      runs(function() {
        $target.waypoint({
          offset: 'bottom-in-view',
          handler: setHitTrue
        })
        $scroller.scrollTop(inview - 1)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(inview)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('destroys the waypoint if triggerOnce is true', function() {
      runs(function() {
        $target.waypoint({
          triggerOnce: true
        })
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return !$.waypoints().vertical.length
      }, 'waypoint to be destroyed')
    })

    it('triggers if continuous is true and waypoint is not last', function() {
      var $near1 = $('#near1')
      var $near2 = $('#near2')
      var hitcount = 0
      runs(function() {
        $target.add($near1).add($near2).waypoint(function() {
          hitcount += 1
        })
        $scroller.scrollTop($near2.offset().top)
      })
      waitsFor(function() {
        return hitcount === 3
      }, 'all waypoints to trigger')
    })

    it('does not trigger if continuous false, waypoint not last', function() {
      var $near1 = $('#near1')
      var $near2 = $('#near2')
      var hitcount = 0
      runs(function() {
        var callback = function() {
          hitcount += 1
        }
        $target.add($near2).waypoint(callback)
        $near1.waypoint(callback, {
          continuous: false
        })
        $scroller.scrollTop($near2.offset().top)
      })
      waitsFor(function() {
        return hitcount === 2
      }, 'all waypoints to trigger')
    })

    it('triggers if continuous false, waypoint is last', function() {
      var $near1 = $('#near1')
      var $near2 = $('#near2')
      var hitcount = 0
      runs(function() {
        var callback = function() {
          hitcount += 1
        }
        $target.add($near1).waypoint(callback)
        $near2.waypoint(callback, {
          continuous: false
        })
        $scroller.scrollTop($near2.offset().top)
      })
      waitsFor(function() {
        return hitcount === 3
      }, 'all waypoints to trigger')
    })
  })

  describe('#waypoint(callback, options)', function() {
    beforeEach(function() {
      $target = $('#same1').waypoint(setHitTrue, {
        offset: -1
      })
    })

    it('creates a waypoint', function() {
      expect($.waypoints().vertical.length).toEqual(1)
    })

    it('respects options', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop($target.offset().top + 1)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })
  })

  describe('#waypoint("disable")', function() {
    beforeEach(function() {
      $target = $('#same1').waypoint(setHitTrue)
      $return = $target.waypoint('disable')
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

    it('returns the same jQuery object for chaining', function() {
      expect($return.get()).toEqual($target.get())
    })
  })

  describe('#waypoint("enable")', function() {
    beforeEach(function() {
      $target = $('#same1').waypoint(setHitTrue)
      $target.waypoint('disable')
      $return = $target.waypoint('enable')
    })

    it('enables callback triggers', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('returns the same jQuery object for chaining', function() {
      expect($return.get()).toEqual($target.get())
    })
  })

  describe('#waypoint("destroy")', function() {
    beforeEach(function() {
      $target = $('#same1').waypoint(setHitTrue)
      $return = $target.waypoint('destroy')
    })

    it('removes waypoint from list of waypoints', function() {
      expect($.waypoints().vertical.length).toEqual(0)
    })

    it('no longer triggers callback', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
      })
    })

    it('does not preserve callbacks if .waypoint recalled', function() {
      runs(function() {
        $target.waypoint({})
        $scroller.scrollTop($target.offset().top)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
      })
    })

    it('returns the same jQuery object for chaining', function() {
      expect($return.get()).toEqual($target.get())
    })

    it('unregisters waypoint even if underlying nodes are removed', function() {
      $target.remove()
      $target.waypoint('destroy')
      expect($.waypoints().vertical.length).toEqual(0)
    })
  })

  describe('#waypoint("prev")', function() {
    it('returns jQuery object container previous waypoint', function() {
      var $near = $('#near1')
      $target = $('#same1')
      $target.add($near).waypoint({})
      expect($near.waypoint('prev')[0]).toEqual($target[0])
    })

    it('can be used in a non-window context', function() {
      var $near = $('#inner2')
      $target = $('#inner1')
      $target.add($near).waypoint({})
      expect($near.waypoint('prev')[0]).toEqual($target[0])
    })
  })

  describe('#waypoint("next")', function() {
    it('returns jQuery object containing next waypoint', function() {
      var $near = $('#near1')
      $target = $('#same1')
      $target.add($near).waypoint({})
      expect($target.waypoint('next')[0]).toEqual($near[0])
    })
  })

  describe('jQuery#waypoints()', function() {
    it('starts as an empty array for each axis', function() {
      expect($.waypoints().vertical.length).toEqual(0)
      expect($.waypoints().horizontal.length).toEqual(0)
    })

    it('returns waypoint elements', function() {
      $target = $('#same1').waypoint({})
      expect($.waypoints().vertical[0]).toEqual($target[0])
    })

    it('does not blow up with multiple waypoints', function() {
      $target = $('.sameposition, #top').waypoint({})
      $target = $target.add($('#near1')).waypoint({})
      expect($.waypoints().vertical.length).toEqual(4)
      expect($.waypoints().vertical[0]).toEqual($('#top')[0])
    })

    it('returns horizontal elements', function() {
      $target = $('#same1').waypoint({
        horizontal: true
      })
      expect($.waypoints().horizontal[0]).toEqual($target[0])
    })

    describe('Directional filters', function() {
      var $other

      beforeEach(function() {
        $target = $('#same1')
        $other = $('#near1')
      })

      describe('above', function() {
        it('returns only waypoints above current scroll', function() {
          runs(function() {
            $target.add($other).waypoint({})
            $scroller.scrollTop(1500)
          })
          waitsFor(function() {
            return $.waypoints('above')[0] === $target[0]
          }, 'target to be above')
        })
      })

      describe('below', function() {
        it('returns only waypoints below current scroll', function() {
          runs(function() {
            $target.add($other).waypoint({})
            $scroller.scrollTop(1500)
          })
          waitsFor(function() {
            return $.waypoints('below')[0] === $other[0]
          }, 'other to be below')
        })
      })

      describe('left', function() {
        it('returns only waypoints left of current scroll', function() {
          runs(function() {
            $target.add($other).waypoint({
              horizontal: true
            })
            $scroller.scrollLeft(1500)
          })
          waitsFor(function() {
            return $.waypoints('left')[0] === $target[0]
          }, 'target to be left')
        })
      })

      describe('right', function() {
        it('returns only waypoints right of current scroll', function() {
          runs(function() {
            $target.add($other).waypoint({
              horizontal: true
            })
            $scroller.scrollLeft(1500)
          })
          waitsFor(function() {
            return $.waypoints('right')[0] === $other[0]
          }, 'other to be right')
        })
      })
    })
  })

  describe('jQuery#waypoints("refresh")', function() {
    var currentDirection

    beforeEach(function() {
      currentDirection = null
      $target = $('#same1').waypoint(function(direction) {
        currentDirection = direction
      })
    })

    it('triggers callback if refresh crosses scroll', function() {
      var top = $target.offset().top
      runs(function() {
        $scroller.scrollTop(top - 1)
      })
      waits(standard)
      runs(function() {
        $target.css('top', (top - 50) + 'px')
        $.waypoints('refresh')
        expect(currentDirection).toEqual('down')
        $target.css('top', top + 'px')
        $.waypoints('refresh')
        expect(currentDirection).toEqual('up')
      })
    })

    it('does not trigger callback if onlyOnScroll true', function() {
      var top, $other
      runs(function() {
        $other = $('#same1').waypoint({
          onlyOnScroll: true,
          handler: setHitTrue
        })
        top = $other.offset().top
      })
      waits(standard)
      runs(function() {
        $other.css('top', (top - 50) + 'px')
        $.waypoints('refresh')
        expect(hit).toBeFalsy()
        $other.css('top', top + 'px')
        $.waypoints('refresh')
        expect(hit).toBeFalsy()
      })
    })

    it('updates the offset', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top - 51)
        $target.css('top', ($target.offset().top - 50) + 'px')
        $.waypoints('refresh')
      })
      waits(standard)
      runs(function() {
        expect(currentDirection).toBeFalsy()
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return currentDirection
      }, 'callback to trigger')
    })
  })

  describe('jQuery#waypoints("viewportHeight")', function() {
    it('returns window innerHeight if it exists', function() {
      if (window.innerHeight) {
        expect($.waypoints('viewportHeight')).toEqual(window.innerHeight)
      }
      else {
        expect($.waypoints('viewportHeight')).toEqual($(window).height())
      }
    })
  })

  describe('jQuery#waypoints("disable")', function() {
    it('disables all waypoints', function() {
      var count = 0
      runs(function() {
        $target = $('.sameposition').waypoint(function() {
          count += 1
        })
        $.waypoints('disable')
        $scroller.scrollTop($target.offset().top + 50)
      })
      waits(standard)
      runs(function() {
        expect(count).toEqual(0)
      })
    })
  })

  describe('jQuery#waypoints("enable")', function() {
    it('enables all waypoints', function() {
      var count = 0
      runs(function() {
        $target = $('.sameposition').waypoint(function() {
          count += 1
        })
        $.waypoints('disable')
        $.waypoints('enable')
        $scroller.scrollTop($target.offset().top + 50)
      })
      waits(standard)
      runs(function() {
        expect(count).toEqual(2)
      })
    })
  })

  describe('jQuery#waypoints("destroy")', function() {
    it('destroys all waypoints', function() {
      $target = $('.sameposition').waypoint({})
      $.waypoints('destroy')
      expect($.waypoints().vertical.length).toEqual(0)
    })
  })

  describe('jQuery#waypoints("extendFn", methodName, function")', function() {
    it('adds method to the waypoint namespace', function() {
      var currentArg
      $.waypoints('extendFn', 'myMethod', function(arg) {
        currentArg = arg
      })
      $('#same1').waypoint('myMethod', 'test')
      expect(currentArg).toEqual('test')
    })
  })

  describe('jQuery.waypoints.settings', function() {
    var count, curId

    beforeEach(function() {
      count = 0
      $('.sameposition, #near1, #near2').waypoint(function() {
        count += 1
        curId = this.id
      })
    })

    it('throttles the scroll check', function() {
      runs(function() {
        $scroller.scrollTop($('#same1').offset().top)
        expect(count).toEqual(0)
      })
      waitsFor(function() {
        return count === 2
      }, 'callbacks to trigger')
    })

    it('throttles the resize event and calls refresh', function() {
      runs(function() {
        $('#same1').css('top', '-1000px')
        $(window).resize()
        expect(count).toEqual(0)
      })
      waitsFor(function() {
        return count === 1
      }, 'callback to trigger')
    })
  })

  describe('non-window scroll context', function() {
    beforeEach(function() {
      $scroller = $('#bottom')
    })

    it('triggers the waypoint within its context', function() {
      $target = $('#inner3').waypoint({
        context: '#bottom',
        handler: setHitTrue
      })
      runs(function() {
        $scroller.scrollTop(199)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(200)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects a % offset within context', function() {
      $target = $('#inner3').waypoint({
        context: '#bottom',
        offset: '100%',
        handler: setHitTrue
      })
      runs(function() {
        $scroller.scrollTop(149)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(150)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects function offsets within context', function() {
      $target = $('#inner3').waypoint({
        context: '#bottom',
        offset: function() {
          return $(this).height() / 2
        },
        handler: setHitTrue
      })
      runs(function() {
        $scroller.scrollTop(149)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(150)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })

    it('respects bottom-in-view alias', function() {
      $target = $('#inner3').waypoint({
        context: '#bottom',
        offset: 'bottom-in-view',
        handler: setHitTrue
      })
      runs(function() {
        $scroller.scrollTop(249)
      })
      waits(standard)
      runs(function() {
        expect(hit).toBeFalsy()
        $scroller.scrollTop(250)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })
  })

  describe('Waypoints added after load, Issue #28, 62, 63', function() {
    it('triggers down on new but already reached waypoints', function() {
      runs(function() {
        $target = $('#same2')
        $scroller.scrollTop($target.offset().top + 1)
      })
      waits(standard)
      runs(function() {
        $target.waypoint(function(direction) {
          hit = direction === 'down'
        })
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })
  })

  describe('Multiple waypoints on the same element', function() {
    var hit2

    beforeEach(function() {
      hit2 = false
      $target = $('#same1').waypoint(setHitTrue)
      $target.waypoint({
        offset: -50,
        handler: function() {
          hit2 = true
        }
      })
    })

    it('triggers all handlers', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top + 50)
      })
      waitsFor(function() {
        return hit && hit2
      }, 'both callbacks to trigger')
    })

    it('uses only one element in $.waypoints array', function() {
      expect($.waypoints().vertical.length).toEqual(1)
    })

    it('disables all waypoints on the element with #disable', function() {
      runs(function() {
        $target.waypoint('disable')
        $scroller.scrollTop($target.offset().top + 50)
      })
      waits(standard)
      runs(function() {
        expect(hit || hit2).toBeFalsy()
      })
    })
  })

  describe('Horizontal waypoints', function() {
    var currentDirection

    beforeEach(function() {
      currentDirection = null
      $target = $('#same1').waypoint({
        horizontal: true,
        handler: function(direction) {
          currentDirection = direction
        }
      })
    })

    it('triggers right/left direction', function() {
      runs(function() {
        $scroller.scrollLeft($target.offset().left)
      })
      waitsFor(function() {
        return currentDirection === 'right'
      }, 'right direction to trigger')
      runs(function() {
        $scroller.scrollLeft($target.offset().left - 1)
      })
      waitsFor(function() {
        return currentDirection === 'left'
      }, 'left direction to trigger')
    })
  })

  describe('Waypoints attached to window object, PR #86', function() {
    $window = $(window)

    beforeEach(function() {
      $target = $window.waypoint({
        offset: -$window.height(),
        handler: setHitTrue
      })
    })

    it('triggers waypoint', function() {
      runs(function() {
        $window.scrollTop($window.height() + 1)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })
  })

  describe('Options object reuse, issue #253', function() {
    beforeEach(function() {
      var options = {
        offset: 0
      }
      $('#same1').waypoint($.noop, options)
      $target = $('#same2').waypoint(setHitTrue, options)
    })

    it('does not override with previous waypoint handler', function() {
      runs(function() {
        $scroller.scrollTop($target.offset().top)
      })
      waitsFor(function() {
        return hit
      }, 'callback to trigger')
    })
  })
})
