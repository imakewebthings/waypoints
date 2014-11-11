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
    })

    if (disableMe.length) {
      disableMe[0].disable()
      $(disableMe[0].element).addClass('disabled')
    }

    $('#enabled-false').waypoint({
      handler: function() {
        notify('Enabled option false')
      },
      enabled: false,
      offset: 99999
    })
  }

  function horizontalExample() {
    $('#horizontal-waypoint').waypoint({
      handler: function(direction) {
        notify([
          'Horizontal waypoint triggered in the',
          direction,
          'direction'
        ].join(' '))
      },
      horizontal: true,
      context: '#overflow-scroll'
    })

    $('#horizontal-waypoint-offset').waypoint({
      handler: function(direction) {
        notify('right-in-view waypoint triggered')
      },
      horizontal: true,
      context: '#overflow-scroll-offset',
      offset: 'right-in-view'
    })
  }

  function offsetExample() {
    $('#number-offset').waypoint({
      handler: function() {
        notify('25px from top')
      },
      offset: 25
    })

    $('#number-offset-negative').waypoint({
      handler: function() {
        notify('25px past the top')
      },
      offset: -25
    })

    $('#percentage-offset').waypoint({
      handler: function() {
        notify('50% from the top')
      },
      offset: '50%'
    })

    $('#percentage-offset-negative').waypoint({
      handler: function() {
        notify('50% past the top')
      },
      offset: '-50%'
    })

    $('#function-offset').waypoint({
      handler: function() {
        notify('Bottom of element hit top of viewport')
      },
      offset: function() {
        return -$(this.element).outerHeight()
      }
    })

    $('#bottom-in-view-example').waypoint({
      handler: function() {
        notify('Bottom of element hit bottom of viewport')
      },
      offset: 'bottom-in-view'
    })

    $('#right-in-view-example').waypoint({
      handler: function() {
        notify('Bottom of element hit bottom of viewport')
      },
      horizontal: true,
      context: '#overflow-scroll-offset',
      offset: 'right-in-view'
    })
  }

  function handlerExample() {
    $('#handler-example').waypoint({
      handler: function(direction) {
        notify('Handler triggered in ' + direction + ' direction')
      },
      offset: 'bottom-in-view'
    })

    $('#handler-horizontal').waypoint({
      handler: function(direction) {
        notify('Handler triggered in ' + direction + ' direction')
      },
      context: '#overflow-scroll',
      horizontal: true
    })
  }

  function destroyAllExample() {
    $('.destroy-all-waypoint').waypoint({
      handler: function() {
        notify(this.element.innerHTML + ' still alve')
      },
      offset: 'bottom-in-view'
    })

    $('button.destroy-all').on('click', function() {
      Waypoint.destroyAll()
      $('.destroy-all-waypoint').removeClass('waypoint')
    })
  }

  function refreshAllExample() {
    $('#refresh-all-waypoint').waypoint({
      handler: function(direction) {
        notify('Waypoint triggered in ' + direction + ' direction')
      },
      offset: 'bottom-in-view'
    })

    $('button.add-with-refresh').on('click', function() {
      $('#refresh-all-waypoint').before('<div class="added">Added</div>')
      Waypoint.refreshAll()
    })

    $('button.add-without-refresh').on('click', function() {
      $('#refresh-all-waypoint').before('<div class="added">Added</div>')
    })
  }

  function viewportHeightExample() {
    $('.show-viewport-height').on('click', function() {
      notify('Viewport Height: ' + Waypoint.viewportHeight())
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
    horizontalExample()
    offsetExample()
    handlerExample()
    destroyAllExample()
    refreshAllExample()
    viewportHeightExample()
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
