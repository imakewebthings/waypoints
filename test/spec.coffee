jasmine.getFixtures().fixturesPath = 'fixtures'
$.waypoints.settings.scrollThrottle = 10
$.waypoints.settings.resizeThrottle = 20
standardWait = 50

# Go tests, go

describe 'jQuery Waypoints', ->
  hit = $se = $e = null

  beforeEach ->
    loadFixtures 'standard.html'
    $se = $ window
    hit = false

  describe '#waypoint()', ->
    beforeEach ->
      $e = $('#same1').waypoint()
      $e.bind 'waypoint.reached', ->
        hit = true

    it 'creates a waypoint', ->
      expect($.waypoints().length).toEqual 1

    it 'is bindable through waypoint.reached', ->
      runs ->
        $se.scrollTop($e.offset().top + 100)
      waits standardWait

      runs ->
        expect(hit).toBeTruthy()

    it 'uses the default offset', ->
      runs ->
        $se.scrollTop($e.offset().top - 1)
      waits standardWait

      runs ->
        expect(hit).toBeFalsy()
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(hit).toBeTruthy()

  describe '#waypoint(callback)', ->
    currentDirection = null

    beforeEach ->
      currentDirection = null
      $e = $('#same1').waypoint (direction) ->
        currentDirection = direction
        hit = true

    it 'creates a waypoint', ->
      expect($.waypoints().length).toEqual 1
    
    it 'triggers the callback', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(hit).toBeTruthy()

    it 'passes correct directions', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(currentDirection).toEqual 'down'
        $se.scrollTop($e.offset().top - 1)
      waits standardWait

      runs ->
        expect(currentDirection).toEqual 'up'

  
  
  describe '#waypoint(options)', ->
    beforeEach ->
      $e = $ '#same1'
      spyOnEvent $e, 'waypoint.reached'
    
    it 'creates a waypoint', ->
      $e.waypoint
        offset: 1
        triggerOnce: true
      expect($.waypoints().length).toEqual 1
    
    it 'respects a px offset', ->
      runs ->
        $e.waypoint
          offset: 50
        $se.scrollTop($e.offset().top - 51)
      waits standardWait

      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $se.scrollTop($e.offset().top - 50)
      waits standardWait

      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects a % offset', ->
      pos = null

      runs ->
        $e.waypoint
          offset: '37%'
        pos = $e.offset().top - $.waypoints('viewportHeight') * .37 - 1
        $se.scrollTop pos
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $se.scrollTop pos + 1
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects a function offset', ->
      runs ->
        $e.waypoint
          offset: ->
            $(this).height() * -1;
        $se.scrollTop($e.offset().top + $e.height() - 1)
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $se.scrollTop($e.offset().top + $e.height())
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects the bottom-in-view function alias', ->
      inview = $e.offset().top \
               - $.waypoints('viewportHeight') \
               + $e.outerHeight();
      
      runs ->
        $e.waypoint
          offset: 'bottom-in-view'
        $se.scrollTop(inview - 1)      
      waits standardWait

      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $se.scrollTop inview
      waits standardWait

      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'destroys the waypoint if triggerOnce is true', ->
      runs ->
        $e.waypoint
          triggerOnce: true
        $se.scrollTop $e.offset().top
      waits standardWait
      
      runs ->
        expect($.waypoints().length).toBeFalsy()
    
    it 'triggers if continuous is true and waypoint is not last', ->
      $f = $ '#near1'
      $g = $ '#near2'
      hitcount = 0;
      
      runs ->
        $e.add($f).add($g).waypoint ->
          hitcount++
        $se.scrollTop $g.offset().top
      waits standardWait
      
      runs ->
        expect(hitcount).toEqual 3
    
    it 'does not trigger if continuous false, waypoint not last', ->
      $f = $ '#near1'
      $g = $ '#near2'
      hitcount = 0
      
      runs ->
        callback = ->
          hitcount++
        options =
          continuous: false
        $e.add($g).waypoint callback
        $f.waypoint callback, options
        $se.scrollTop $g.offset().top
      waits standardWait
      
      runs ->
        expect(hitcount).toEqual 2
    
    it 'triggers if continuous is false, waypoint is last', ->
      $f = $ '#near1'
      $g = $ '#near2'
      hitcount = 0
      
      runs ->
        callback = ->
          hitcount++
        options =
          continuous: false
        $e.add($f).waypoint callback
        $g.waypoint callback, options
        $se.scrollTop $g.offset().top
      waits standardWait
      
      runs ->
        expect(hitcount).toEqual 3
    
    it 'uses the handler option if provided', ->
      hitcount = 0
      
      runs ->
        $e.waypoint
          handler: (dir) ->
            hitcount++
        $se.scrollTop $e.offset().top
      waits standardWait
      
      runs ->
        expect(hitcount).toEqual 1
  
  describe '#waypoint(callback, options)', ->
    beforeEach ->
      callback = ->
        hit = true
      options =
        offset: -1
      $e = $('#same1').waypoint callback, options
    
    it 'creates a waypoint', ->
      expect($.waypoints().length).toEqual 1
    
    it 'respects options', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(hit).toBeFalsy()
        $se.scrollTop($e.offset().top + 1)
      waits standardWait

      runs ->
        expect(hit).toBeTruthy()
    
    it 'fires the callback', ->
      runs ->
        $se.scrollTop($e.offset().top + 1)
      waits(standardWait);

      runs ->
        expect(hit).toBeTruthy()

  describe '#waypoint("disable")', ->
    beforeEach ->
      $e = $('#same1').waypoint ->
        hit = true
      $e.waypoint 'disable'

    it 'disables callback triggers', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(hit).toBeFalsy()

  describe '.waypoint("enable")', ->
    beforeEach ->
      $e = $('#same1').waypoint ->
        hit = true
      $e.waypoint 'disable'
      $e.waypoint 'enable'

    it 'enables callback triggers', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait

      runs ->
        expect(hit).toBeTruthy()
  
  describe '#waypoint("destroy")', ->
    beforeEach ->
      $e = $('#same1').waypoint ->
        hit = true
      $e.waypoint 'destroy'
    
    it 'removes waypoint from list of waypoints', ->
      expect($.waypoints().length).toBeFalsy()
    
    it 'no longer triggers waypoint.reached', ->
      runs ->
        $se.scrollTop $e.offset().top
      waits standardWait
      
      runs ->
        expect(hit).toBeFalsy()
    
    it 'does not preserve callbacks if .waypoint recalled', ->
      runs ->
        $e.waypoint()
        $se.scrollTop $e.offset().top
      waits standardWait
      
      runs ->
        expect(hit).toBeFalsy()
  
  describe 'jQuery#waypoints()', ->
    it 'starts as an empty array', ->
      expect($.waypoints().length).toBeFalsy()
      expect($.isArray $.waypoints()).toBeTruthy()
    
    it 'returns waypoint elements', ->
      $e = $('#same1').waypoint()
      expect($.waypoints()[0]).toEqual $e[0];
    
    it 'works with multiple waypoints', ->
      $e = $('.sameposition, #top').waypoint()
      $e = $e.add $('#near1').waypoint()
      expect($.waypoints().length).toEqual 4
      expect($.waypoints()[0]).toEqual $('#top')[0]
  
  describe 'jQuery#waypoints("refresh")', ->
    currentDirection = null
    
    beforeEach ->
      currentDirection = null
      $e = $('#same1').waypoint (direction) ->
        currentDirection = direction
      spyOnEvent $e, 'waypoint.reached'
    
    it 'triggers waypoint.reached if refresh crosses scroll', ->
      runs ->
        $se.scrollTop($e.offset().top - 1)
      waits standardWait
      
      runs ->
        $e.css('top', ($e.offset().top - 50) + 'px')
        $.waypoints 'refresh'
        expect(currentDirection).toEqual 'down'
        $e.css('top', $e.offset().top + 50 + 'px')
        $.waypoints 'refresh'
        expect(currentDirection).toEqual 'up'
    
    it 'does not trigger waypoint.reached if onlyOnScroll true', ->
      $f = null
      
      runs ->
        $f = $('#same2').waypoint
          onlyOnScroll: true
        $se.scrollTop($f.offset().top - 1)
        spyOnEvent $f, 'waypoint.reached'
      waits standardWait
      
      runs ->
        $e.css('top', ($f.offset().top - 50) + 'px')
        $.waypoints 'refresh'
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $f
        $e.css('top', $f.offset().top + 50 + 'px')
        $.waypoints 'refresh'
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $f
    
    it 'updates the offset', ->
      runs ->
        $se.scrollTop($e.offset().top - 51)
        $e.css('top', ($e.offset().top - 50) + 'px')
        $.waypoints 'refresh'
      waits(standardWait);
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $se.scrollTop $e.offset().top
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
  
  describe '$.waypoints("viewportHeight")', ->
    it 'returns window innerheight if it exists', ->
      if window.innerHeight
        expect($.waypoints 'viewportHeight').toEqual window.innerHeight
      else
        expect($.waypoints 'viewportHeight').toEqual $(window).height()
  
  describe '$.waypoints.settings', ->
    count = curID = null
    
    beforeEach ->
      count = 0
      $('.sameposition, #near1, #near2').waypoint ->
        count++
        curID = $(this).attr 'id'
    
    it 'throttles the scroll check', ->
      runs ->
        $se.scrollTop $('#same1').offset().top
        expect(count).toEqual 0
      waits standardWait
      
      runs ->
        expect(count).toEqual 2
    
    it 'throttles the resize event and calls refresh', ->
      runs ->
        $('#same1').css 'top', "-1000px"
        $(window).resize()
        expect(count).toEqual 0
      waits standardWait
      
      runs ->
        expect(count).toEqual 1
  
  describe 'non-window scroll context', ->
    $inner = null
    
    beforeEach ->
      $inner = $ '#bottom'
    
    it 'triggers the waypoint within its context', ->
      $e = $('#inner3').waypoint
        context: '#bottom'
      
      runs ->
        spyOnEvent $e, 'waypoint.reached'
        $inner.scrollTop 199
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $inner.scrollTop 200
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects % offsets within contexts', ->
      $e = $('#inner3').waypoint
        context: '#bottom'
        offset: '100%'
      
      runs ->
        spyOnEvent $e, 'waypoint.reached'
        $inner.scrollTop 149
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $inner.scrollTop 150
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects function offsets within context', ->
      $e = $('#inner3').waypoint
        context: '#bottom'
        offset: ->
          $(this).height() / 2
      
      runs ->
        spyOnEvent $e, 'waypoint.reached'
        $inner.scrollTop 149
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $inner.scrollTop 150
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    it 'respects bottom-in-view alias', ->
      $e = $('#inner3').waypoint
        context: '#bottom'
        offset: 'bottom-in-view'
      
      runs ->
        spyOnEvent $e, 'waypoint.reached'
        $inner.scrollTop 249
      waits standardWait
      
      runs ->
        expect('waypoint.reached').not.toHaveBeenTriggeredOn $e
        $inner.scrollTop 250
      waits standardWait
      
      runs ->
        expect('waypoint.reached').toHaveBeenTriggeredOn $e
    
    afterEach ->
      $inner.scrollTop 0
  
  describe 'Waypoints added after load, Issue #28, 62, 63', ->
    it 'triggers down on new but already reached waypoints', ->
      runs ->
        $e = $ '#same2'
        $se.scrollTop($e.offset().top + 1)
      waits standardWait
      
      runs ->
        $e.waypoint (direction) ->
          if direction is 'down'
            hit = true

      waitsFor (-> hit), '#same2 to trigger', 1000

  describe 'Multiple waypoints on the same element', ->
    hit2 = false

    beforeEach ->
      hit2 = false
      $e = $('#same1').waypoint
        handler: ->
          hit = true
      $e.waypoint
        handler: ->
          hit2 = true
        offset: -50

    it 'triggers all handlers', ->
      runs ->
        $se.scrollTop($e.offset().top + 50)
      waits standardWait

      runs ->
        expect(hit and hit2).toBeTruthy()

    it 'uses only one element in $.waypoints() array', ->
      expect($.waypoints().length).toEqual 1

    it 'disables all waypoints on the element when #disabled called', ->
      runs ->
        $e.waypoint 'disable'
        $se.scrollTop($e.offset().top + 50)
      waits standardWait

      runs ->
        expect(hit or hit2).toBeFalsy()

  afterEach ->
    $.each $.waypoints(), (i, el) ->
      $(el).waypoint 'destroy'
    $se.scrollTop 0
    hit = false
    waits standardWait
