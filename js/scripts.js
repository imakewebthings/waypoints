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

  function viewportWidthExample() {
    $('.show-viewport-width').on('click', function() {
      notify('Viewport Width: ' + Waypoint.viewportWidth())
    })
  }

  function contextDestroyExample() {
    function notifyInnerHTML() {
      notify(this.element.innerHTML + ' hit')
    }

    $('.left-context-waypoint').waypoint({
      handler: notifyInnerHTML,
      context: '#left-context'
    })

    $('.right-context-waypoint').waypoint({
      handler: notifyInnerHTML,
      context: '#right-context'
    })

    $('button.destroy-left-context').on('click', function() {
      Waypoint.Context.findByElement($('#left-context')[0]).destroy()
      $('.left-context-waypoint').removeClass('waypoint')
    })

    $('button.destroy-right-context').on('click', function() {
      Waypoint.Context.findByElement($('#right-context')[0]).destroy()
      $('.right-context-waypoint').removeClass('waypoint')
    })
  }

  function findByElementExample() {
    var waypoint

    $('button.find-create').on('click', function() {
      waypoint = new Waypoint({
        element: document.getElementById('find-by-example'),
        handler: function(direction) {
          notify('Waypoint hit')
        },
        context: document.getElementById('overflow-scroll')
      })
      $(waypoint.element).addClass('waypoint')
      $(this).hide()
      $('button.find-destroy').show()
    })

    $('button.find-destroy').on('click', function() {
      waypoint.destroy()
      $(waypoint.element).removeClass('waypoint')
      $(this).hide()
      $('button.find-create').show()
    })

    $('button.find-by-element').on('click', function() {
      var context = Waypoint.Context.findByElement($('#overflow-scroll')[0])
      if (typeof context === 'undefined') {
        notify('Context does not exist')
      }
      else if (context instanceof Waypoint.Context) {
        notify('Context found')
      }
    })
  }

  function firstExample() {
    if (!$('#first-example').length) {
      return;
    }

    function handler(direction) {
      if (this === this.group.first()) {
        notify('First ' + this.group.name + ' hit')
      }
      else {
        notify('Some other ' + this.group.name + ' hit')
      }
    }

    $('.group-even').waypoint({
      handler: handler,
      offset: 'bottom-in-view',
      group: 'even'
    })

    $('.group-odd').waypoint({
      handler: handler,
      offset: 'bottom-in-view',
      group: 'odd'
    })
  }

  function lastExample() {
    if (!$('#last-example').length) {
      return;
    }

    function handler(direction) {
      if (this === this.group.last()) {
        notify('Last ' + this.group.name + ' hit')
      }
      else {
        notify('Some other ' + this.group.name + ' hit')
      }
    }

    $('.group-even').waypoint({
      handler: handler,
      offset: 'bottom-in-view',
      group: 'even'
    })

    $('.group-odd').waypoint({
      handler: handler,
      offset: 'bottom-in-view',
      group: 'odd'
    })
  }

  function waypointClassExamples() {
    $('#new-operator, #options-only, #handler-only').waypoint({
      handler: function(direction) {
        notify(this.element.id + ' hit')
      }
    })
    $('#handler-first').waypoint(function(direction) {
      notify(this.element.id + ' hit 25% from the top of window')
    }, {
      offset: '25%'
    })
    $('#adapter-property-example').waypoint(function(direction) {
      notify('Using jQuery adapter: ' + !!this.adapter.$element)
    }, {
      offset: '25%'
    })
    $('#context-property-example').waypoint(function(direction) {
      notify('Context: ' + this.context.element)
    }, {
      offset: '25%'
    })
    $('#element-property-example').waypoint(function(direction) {
      notify('Waypoint element id: ' + this.element.id)
    }, {
      offset: '25%'
    })
    $('#group-property-example').waypoint(function(direction) {
      notify('Group: ' + this.group.name)
    }, {
      offset: '25%'
    })
    $('#options-property-example').waypoint(function(direction) {
      notify('Offset option: ' + this.options.offset)
    }, {
      offset: '50%'
    })
    $('#trigger-point-example').waypoint(function(direction) {
      notify('Trigger point: ' + this.triggerPoint)
    }, {
      offset: 'bottom-in-view'
    })
  }

  function contextClassExamples() {
    $('#context-adapter-example').waypoint(function(direction) {
      notify('Scrolltop value: ' + this.context.adapter.scrollTop())
    }, {
      offset: '25%'
    })
    $('#context-element-example').waypoint(function(direction) {
      notify('Context element: ' + this.context.element)
    }, {
      offset: '25%'
    })
    $('#context-waypoints-example').waypoint(function(direction) {
      $.each(this.context.waypoints, function(axis, waypoints) {
        $.each(waypoints, function(key, waypoint) {
          notify([axis, key, waypoint.element.id].join(' / '))
        })
      })
    }, {
      offset: 'bottom-in-view'
    })
  }

  function groupClassExamples() {
    $('#group-axis-example').waypoint(function(direction) {
      notify('Axis: ' + this.group.axis)
    }, {
      offset: '50%'
    })
    $('#group-name-example').waypoint(function(direction) {
      notify('Name: ' + this.group.name)
    }, {
      group: 'custom-group',
      offset: '50%'
    })
    $('#group-waypoints-example').waypoint(function(direction) {
      notify('Group waypoint count: ' + this.group.waypoints.length)
    }, {
      group: 'custom-group',
      offset: 'bottom-in-view'
    })
  }

  function stickyExample() {
    var $stickyElement = $('.basic-sticky-example')
    var sticky

    if ($stickyElement.length) {
      sticky = new Waypoint.Sticky({
        element: $stickyElement[0],
        wrapper: '<div class="sticky-wrapper waypoint" />'
      })
      $('button.destroy-sticky').on('click', function() {
        sticky.destroy()
      })
    }
  }

  function infiniteExample() {
    var infinite = new Waypoint.Infinite({
      element: $('.infinite-container')[0]
    })
  }

  function inviewExample() {
    var $example = $('#inview-example')
    var inview

    if ($example.length) {
      inview = new Waypoint.Inview({
        element: $('#inview-example')[0],
        enter: function(direction) {
          notify('Enter triggered with direction ' + direction)
        },
        entered: function(direction) {
          notify('Entered triggered with direction ' + direction)
        },
        exit: function(direction) {
          notify('Exit triggered with direction ' + direction)
        },
        exited: function(direction) {
          notify('Exited triggered with direction ' + direction)
        }
      })
    }

    $('.destroy-inview').on('click', function() {
      $example.removeClass('waypoint')
      inview.destroy()
    })

    $('.disable-inview').on('click', function() {
      $example.addClass('disabled')
      inview.disable()
    })

    $('.enable-inview').on('click', function() {
      $example.removeClass('disabled')
      inview.enable()
    })
  }

  function displayNoneExample() {
    var $displayNoneExample = $('#display-none-example')
    var waypoint

    if (!$displayNoneExample.length) {
      return
    }

    waypoint = $displayNoneExample.waypoint(function(direction) {
      notify('display:none example triggered')
    })[0]

    $('.display-none-toggle').on('click', function() {
      var $this = $(this)
      var isHidden = $this.text() === $this.data('show')
      $displayNoneExample.toggle(isHidden)
      $this.text($this.data(isHidden ? 'hide' : 'show'))
    })

    $('.display-trigger-point').on('click', function() {
      notify('Trigger point: ' + waypoint.triggerPoint);
    })

    $('.refresh-all').on('click', function() {
      Waypoint.refreshAll()
    })
  }

  function enableDisableAllExample() {
    $('.enable-disable-all').waypoint({
      handler: function() {
        notify('Waypoint triggered')
      },
      offset: 'bottom-in-view'
    })
    $('button.enable-all').on('click', function() {
      Waypoint.enableAll()
      $('.enable-disable-all').removeClass('disabled')
    })
    $('button.disable-all').on('click', function() {
      Waypoint.disableAll()
      $('.enable-disable-all').addClass('disabled')
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
    viewportWidthExample()
    contextDestroyExample()
    findByElementExample()
    firstExample()
    lastExample()
    waypointClassExamples()
    contextClassExamples()
    groupClassExamples()
    stickyExample()
    infiniteExample()
    inviewExample()
    displayNoneExample()
    enableDisableAllExample()
  }

  function initMobileSubnav() {
    $('.subsection-nav a').on('click', function(event) {
      var $this = $(this)
      var $nav =  $this.closest('.subsection-nav')
      var onClass = $.grep($nav[0].className.split(' '), function(c) {
        return c !== 'subsection-nav' && c.indexOf('on-') >= 0
      })[0]
      if ($this.hasClass(onClass.replace('on', 'nav'))) {
        event.preventDefault()
        $nav.toggleClass('expanded')
      }
    })
  }

  $(function() {
    initVariables()
    centerMain()
    initMobileSubnav()
  })

  $(window).on('resize load', function() {
    centerMain()
  }).on('load', function() {
    initGettingStarted()
    initApiExamples()
  })

  window.notify = notify
}())
