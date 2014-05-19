describe('Waypoints Sticky Elements Shortcut', function() {
  var standard = 50
  var $window = $(window)
  var $sticky, $return, handlerSpy

  beforeEach(function() {
    loadFixtures('sticky.html')
    $sticky = $('.sticky')
    handlerSpy = jasmine.createSpy('on handler')
    $return = $sticky.waypoint('sticky', {
      handler: handlerSpy
    })
  })

  afterEach(function() {
    $.waypoints('destroy')
    $window.scrollTop(0)
    waits(standard)
  })

  it('returns the same jQuery object for chaining', function() {
    expect($return.get()).toEqual($sticky.get())
  })

  it('wraps the sticky element', function() {
    expect($sticky.parent()).toHaveClass('sticky-wrapper')
  })

  it('gives the wrapper the same height as the sticky element', function() {
    expect($sticky.parent().height()).toEqual($sticky.outerHeight())
  })

  it('adds stuck class when you scroll to the element', function() {
    runs(function() {
      $window.scrollTop($sticky.offset().top)
    })
    waitsFor(function() {
      return $sticky.hasClass('stuck')
    }, 'stuck class to apply')
    runs(function() {
      $window.scrollTop($window.scrollTop() - 1)
    })
    waitsFor(function() {
      return !$sticky.hasClass('stuck')
    })
  })

  it('executes handler option after stuck class applied', function() {
    runs(function() {
      $window.scrollTop($sticky.offset().top)
    })
    waitsFor(function() {
      return handlerSpy.callCount
    }, 'callback to trigger')
  })

  describe('#waypoint("unsticky")', function() {
    beforeEach(function() {
      $return = $sticky.waypoint('unsticky')
    })

    it('returns the same jQuery object for chaining', function() {
      expect($return.get()).toEqual($sticky.get())
    })

    it('unwraps the sticky element', function() {
      expect($sticky.parent()).not.toHaveClass('sticky-wrapper')
    })

    it('should not have stuck class', function() {
      expect($sticky).not.toHaveClass('stuck')
    })

    it('does nothing if called on a non-sticky element', function() {
      $parent = $sticky.parent()
      $sticky.waypoint('unsticky')
      expect($parent.closest('body')).toExist()
    })
  })
})
