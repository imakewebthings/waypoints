/* Smooth scrolling of links between panels */
$(function() {
  var $panels = $('.panel');

  $panels.each(function() {
    var $panel = $(this);
    var hash = '#' + this.id;

    $('a[href="' + hash + '"]').click(function(event) {
      $('html, body').stop().animate({
        scrollLeft: $panel.offset().left,
        scrollTop: 0
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
  var $scroller = $('html, body');
  var $window = $(window);
  var timer;

  $window.resize(function() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      var hash = window.location.hash ? window.location.hash : '#about';

      $scroller.stop().animate({
        scrollLeft: $(hash).offset().left
      }, 200);
    }, 100);
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


