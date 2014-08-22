(function() {
  var $document = $(document)
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

  function initGettingStarted() {
    if (!$('.subsection-nav').is('.on-getting-started')) {
      return
    }

    new Waypoint({
      element: document.getElementById('useless-waypoint')
    })

    new Waypoint({
      element: document.getElementById('basic-waypoint'),
      handler: function() {
        notify('Basic waypoint triggered')
      }
    })

    new Waypoint({
      element: document.getElementById('direction-waypoint'),
      handler: function(direction) {
        notify('Direction: ' + direction)
      }
    })

    new Waypoint({
      element: document.getElementById('px-offset-waypoint'),
      handler: function(direction) {
        notify('I am 20px from the top of the window')
      },
      offset: 20
    })

    new Waypoint({
      element: document.getElementById('element-waypoint'),
      handler: function(direction) {
        notify(this.element.id + ' triggers at ' + this.triggerPoint)
      },
      offset: 'bottom-in-view'
    })
  }

  function initApiExamples() {
    var disableEnableWaypoint = $('#disable-enable-example').waypoint({
      handler: function() {
        notify('I am enabled')
      },
      offset: 'bottom-in-view'
    })[0]

    var destroyWaypoint = $('#destroy-example').waypoint({
      handler: function() {
        notify('I am still alive')
      },
      offset: 'bottom-in-view'
    })[0]

    $document.on('click', 'button.disable', function() {
      disableEnableWaypoint.disable()
      $(disableEnableWaypoint.element).addClass('disabled')
    })
    $document.on('click', 'button.enable', function() {
      disableEnableWaypoint.enable()
      $(disableEnableWaypoint.element).removeClass('disabled')
    })
    $document.on('click', 'button.destroy', function() {
      destroyWaypoint.destroy()
      $(destroyWaypoint.element).removeClass('waypoint')
    })

    $('#trigger-once-example').waypoint({
      handler: function() {
        notify('Triggered once, now destroyed')
        $(this.element).removeClass('waypoint')
        this.destroy()
      },
      offset: 'bottom-in-view'
    })
  }

  $(function() {
    initVariables()
    centerMain()
    initGettingStarted()
    initApiExamples()
  })

  $(window).on('resize load', function() {
    centerMain()
  })

  window.notify = notify
}())
