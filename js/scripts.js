(function() {
  var $footer, $header, $main, $window, $notification

  function initVariables() {
    $footer = $('footer')
    $header = $('header')
    $main = $('main')
    $window = $(window)
    $notifications = $('.notifications')
  }

  function centerMain() {
    var taken = $header.outerHeight(true) + $footer.outerHeight(true)
    var availableHeight = $window.height() - $main.outerHeight() - taken
    $main.css('top', availableHeight > 0 ? availableHeight / 2 : 0)
  }

  function notify(text) {
    var $notification = $('<li />').text(text).css({
      left: 320
    })
    $notifications.append($notification)
    $notification.animate({
      left: 0
    }, 300, function() {
      $(this).delay(3000).animate({
        left: 320
      }, 200, function() {
        $(this).slideUp(100, function() {
          $(this).remove()
        })
      })
    })
  }

  $(function() {
    initVariables()
    centerMain()
  })

  $(window).on('resize load', function() {
    centerMain()
  })

  window.notify = notify
}())
