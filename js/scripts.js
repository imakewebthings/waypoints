(function() {
  var $footer, $header, $main, $window

  function initVariables() {
    $footer = $('footer')
    $header = $('header')
    $main = $('main')
    $window = $(window)
  }

  function centerMain() {
    var taken = $header.outerHeight(true) + $footer.outerHeight(true)
    var availableHeight = $window.height() - $main.outerHeight() - taken
    $main.css('top', availableHeight > 0 ? availableHeight / 2 : 0)
  }

  $(function() {
    initVariables()
    centerMain()
  })

  $(window).on('resize load', function() {
    centerMain()
  })
}())
