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

  function disableEnableExample() {
    var disableEnableWaypoint = $('#disable-enable-example').waypoint({
      handler: function() {
        notify('I am enabled')
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
  }

  function destroyExample() {
    var destroyWaypoint = $('#destroy-example').waypoint({
      handler: function() {
        notify('I am still alive')
      },
      offset: 'bottom-in-view'
    })[0]

    $document.on('click', 'button.destroy', function() {
      destroyWaypoint.destroy()
      $(destroyWaypoint.element).removeClass('waypoint')
    })
  }

  function triggerOnceExample() {
    $('#trigger-once-example').waypoint({
      handler: function() {
        notify('Triggered once, now destroyed')
        $(this.element).removeClass('waypoint')
        this.destroy()
      },
      offset: 'bottom-in-view'
    })
  }

  function nextPreviousExample() {
    $.each(['np-left', 'np-right'], function(i, classname) {
      var $elements = $('.' + classname)

      $elements.waypoint({
        handler: function(direction) {
          var previousWaypoint = this.previous()
          var nextWaypoint = this.next()

          $elements.removeClass('np-previous np-current np-next')
          $(this.element).addClass('np-current')
          if (previousWaypoint) {
            $(previousWaypoint.element).addClass('np-previous')
          }
          if (nextWaypoint) {
            $(nextWaypoint.element).addClass('np-next')
          }
        },
        offset: '50%',
        group: classname
      })
    })
  }

  function contextExample() {
    $('#context-example').waypoint({
      handler: function() {
        notify('Context example triggered')
      },
      context: '#overflow-scroll'
    })

    $('#context-example-offset').waypoint({
      handler: function() {
        notify('Hit midpoint of my context')
      },
      context: '#overflow-scroll-offset',
      offset: '50%'
    })
  }

  function continuousExample() {
    var handler = function() {
      notify(this.element.innerHTML + ' hit')
    }

    $('.continuous-true').waypoint({
      handler: handler
    })

    $('.continuous-false').waypoint({
      handler: handler,
      continuous: false
    })

    $('.continuous-group-left').waypoint({
      handler: handler,
      continuous: false,
      group: 'continuous-left'
    })

    $('.continuous-group-right').waypoint({
      handler: handler,
      continuous: false,
      group: 'continuous-right'
    })

    $('.continuous-mix-true').waypoint({
      handler: handler,
      offset: 'bottom-in-view'
    })

    $('.continuous-mix-false').waypoint({
      handler: handler,
      offset: 'bottom-in-view',
      continuous: false
    })
  }

  function enabledExample() {
    var disableMe = $('#disabled-after').waypoint({
      handler: function() {
        notify('Disabled after creation')
      },
      offset: 99999
    })[0]

    disableMe.disable()
    $(disableMe.element).addClass('disabled')

    $('#enabled-false').waypoint({
      handler: function() {
        notify('Enabled option false')
      },
      enabled: false,
      offset: 99999
    })
  }

  function initApiExamples() {
    disableEnableExample()
    destroyExample()
    triggerOnceExample()
    nextPreviousExample()
    contextExample()
    continuousExample()
    enabledExample()
  }

  $(function() {
    initVariables()
    centerMain()
  })

  $(window).on('resize load', function() {
    centerMain()
  }).on('load', function() {
    initGettingStarted()
    initApiExamples()
  })

  window.notify = notify
}())
