describe('Waypoints Infinite Scroll Shortcut', function() {
  var standard = 50
  var $window = $(window)
  var $items, $container, $more, beforeHit, afterHit

  beforeEach(function() {
    loadFixtures('infinite.html')
    $items = $('.infinite-item')
    $container = $('.infinite-container')
    $more = $('.infinite-more-link')
    beforeHit = afterHit = false
  })

  afterEach(function() {
    runs(function() {
      $.waypoints('destroy')
      $window.scrollTop(0)
    })
    waits(standard)
  })

  it('returns the same jQuery object for chaining', function() {
    expect($container.waypoint('infinite').get()).toEqual($container.get())
  })

  describe('loading new pages', function() {
    beforeEach(function() {
      runs(function() {
        var triggerPoint = $.waypoints('viewportHeight') - $container.height()
        $container.waypoint('infinite', {
          onBeforePageLoad: function() {
            beforeHit = true
          },
          onAfterPageLoad: function() {
            afterHit = true
          }
        })
        $window.scrollTop(triggerPoint)
      })
      waitsFor(function() {
        return $('.infinite-container > .infinite-item').length > $items.length
      }, 'new items to load')
    })

    it('replaces the more link with the new more link', function() {
      expect($more[0]).not.toEqual($('.infinite-more-link')[0])
    })

    it('fires the before callback', function() {
      expect(beforeHit).toBeTruthy()
    })

    it('fires the after callback', function() {
      expect(afterHit).toBeTruthy()
    })
  })

  describe('when there is no more link on initialization', function() {
    beforeEach(function() {
      $more.remove()
      $container.waypoint('infinite')
    })

    it('does not create the waypoint', function() {
      expect($.waypoints().vertical.length).toEqual(0)
    })
  })
})
