$.waypoints.settings.scrollThrottle = 10
$.waypoints.settings.resizeThrottle = 20
standardWait = 50

describe 'Waypoints Sticky Elements Shortcut', ->
  $sticky = $return = null
  $win = $ window

  beforeEach ->
    loadFixtures 'sticky.html'
    $sticky = $ '.sticky'
    $return = $sticky.waypoint 'sticky'

  it 'returns the same jQuery object for chaining', ->
    expect($return.get()).toEqual $sticky.get()

  it 'wraps the sticky element', ->
    expect($sticky.parent()).toHaveClass 'sticky-wrapper'

  it 'gives the wrapper the same height as the sticky element', ->
    expect($sticky.parent().height()).toEqual $sticky.height()

  it 'adds stuck class when you reach the element', ->
    runs ->
      $win.scrollTop $sticky.offset().top
    waits standardWait

    runs ->
      expect($sticky).toHaveClass 'stuck'
      $win.scrollTop $win.scrollTop()-1
    waits standardWait

    runs ->
      expect($sticky).not.toHaveClass 'stuck'

  afterEach ->
    $.waypoints 'destroy'
    $win.scrollTop 0

