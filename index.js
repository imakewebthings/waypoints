(function() {
  // http://www.zachstronaut.com/posts/2009/01/18/jquery-smooth-scroll-bugs.html
  var scrollElement = 'html, body';
  var $scrollElement;

  $(function() {
    $('html, body').each(function () {
      var initScrollLeft = $(this).attr('scrollLeft');
      
      $(this).attr('scrollLeft', initScrollLeft + 1);
      if ($(this).attr('scrollLeft') == initScrollLeft + 1) {
        scrollElement = this.nodeName.toLowerCase();
        $(this).attr('scrollLeft', initScrollLeft);
        return false;
      }    
    });
    $scrollElement = $(scrollElement);
  });

  /* Smooth scrolling of links between panels */
  $(function() {
    var $panels = $('.panel');

    $panels.each(function() {
      var $panel = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $scrollElement.stop().animate({
          scrollLeft: $panel.offset().left
        }, 500, 'swing', function() {
          window.location.hash = hash;
        });

        event.preventDefault();
      });
    });
  });

  /* Panel waypoints for setting high-level location classes on body. */
  $(function() {
    var $body = $('body');

    $('.panel')
      .waypoint(function(direction) {
        $body.toggleClass(this.id + '-visible', direction === 'right');
      }, {
        offset: '50%',
        horizontal: true
      })
      .waypoint(function(direction) {
        $body.toggleClass(this.id + '-visible', direction === 'left');
      }, {
        offset: '-50%',
        horizontal: true
      });
  });

  /* Force snap to panel on resize. */
  $(function() {
    var $window = $(window);
    var timer;

    $window.resize(function() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        var hash = window.location.hash ? window.location.hash : '#about';

        $scrollElement.stop().animate({
          scrollLeft: $(hash).offset().left
        }, 200);
      }, 100);
    });
  });

  /* Fix scroll snapping during browser finds */
  $(function() {
    var $window = $(window);
    var timer;

    /* Most finds will scroll a single panel. */
    var scrollToPanel = function(panel) {
      $scrollElement.scrollLeft($(panel).offset().left);
    };

    /* Others will scroll between panels but not cause a panel scroll */
    var scrollToClosestPanel = function() {
      var currentScroll = $window.scrollLeft();
      var panelOffsets = $.map($('.panel').get(), function(el) {
        return $(el).offset().left;
      });
      var closestOffset = 0;
      var closestDistance = 99999999;

      $.each(panelOffsets, function(i, offset) {
        var offsetDistance = Math.abs(currentScroll - offset);
        if(offsetDistance < closestDistance) {
          closestDistance = offsetDistance;
          closestOffset = offset;
        }
      });
      $scrollElement.scrollLeft(closestOffset);
    };

    $('.panel').scroll(function() {
      window.clearTimeout(timer);
      timer = window.setTimeout(scrollToPanel, 50, this);
    });

    /* 50ms is enough time to let the animation between panels do its
       thing without triggering this debounced panel snap. */
    $window.scroll(function() {
      window.clearTimeout(timer);
      timer = window.setTimeout(scrollToClosestPanel, 50);
    });
  });

  /* Docs nav highlighting */
  $(function() {
    $('.doc-section')
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'down');
      }, {
        context: '#docs',
        offset: '100%'
      })
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'up');
      }, {
        context: '#docs',
        offset: function() {
          return -$(this).height();
        }
      });
  });

  /* Get Started section notification examples */
  $(function() {
    var notify = function(message) {
      var $message = $('<p style="display:none;">' + message + '</p>');

      $('.notifications').append($message);
      $message.slideDown(300, function() {
        window.setTimeout(function() {
          $message.slideUp(300, function() {
            $message.remove();
          });
        }, 2000);
      });
    };

    $('#example-basic').waypoint(function() {
     notify('Basic example callback triggered.');
    }, { context: '.panel' });

    $('#example-direction').waypoint(function(direction) {
      notify('Direction example triggered scrolling ' + direction);
    }, { context: '.panel' });

    $('#example-offset-pixels').waypoint(function() {
      notify('100 pixels from the top');
    }, {
      offset: 100,
      context: '.panel'
    });

    $('#example-offset-percent').waypoint(function() {
      notify('25% from the top');
    }, {
      offset: '25%',
      context: '.panel'
    });

    $('#example-offset-function').waypoint(function() {
      notify('Element bottom hit window top');
    }, {
      offset: function() {
        return -$(this).height();
      },
      context: '.panel'
    });

    $('#example-context').waypoint(function() {
      notify('Hit top of context');
    }, { context: '.example-scroll-div' });

    $('#example-handler').waypoint({
      handler: function() {
        notify('Handler option used');
      },
      offset: '50%',
      context: '.panel'
    });
  });

  /* Centering for About and Shortcut panels */
  $(function() {
    var $window = $(window);
    var $centered = $('#about .inner, #shortcuts-examples .inner')

    var center = function() {
      var winHeight = $.waypoints('viewportHeight');

      $centered.each(function() {
        var $el = $(this);
        var top = (winHeight - $el.height()) / 2;

        top = top > 60 ? top : 60;
        $el.css('top', top);
      })
    };

    center();
    $window.load(center).resize(center);
  });
})();




