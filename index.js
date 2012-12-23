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
      offset: 200,
      horizontal: true
    })
    .waypoint(function(direction) {
      $body.toggleClass(this.id + '-visible', direction === 'left');
    }, {
      offset: function() {
        return -$(window).width() + 200;
      },
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




