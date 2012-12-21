/* Smooth scrolling of links between panels */
$(function() {
  var $panels = $('.panel');

  $panels.each(function() {
    var panel = $(this);
    var hash = this.id;

    $('a[href="#' + hash + '"]').click(function(event) {
      var offset = panel.offset();
      
      $('html, body').stop().animate({
        scrollLeft: offset.left,
        scrollTop: offset.top
      }, 500, 'swing', function() {
        window.location.hash = hash;
      });

      event.preventDefault();
    });
  });
});

/* Set high-level location classes on body. Used for navigation states. */
$(function() {
  var $body = $('body');

  $body.addClass('top-visible left-visible');

  $('#about')
    .waypoint(function(direction) {
      $body.toggleClass('bottom-visible', direction === 'down');
    }, { offset: -1 })
    .waypoint(function(direction) {
      $body.toggleClass('right-visible', direction === 'right');
    }, {
      offset: -1,
      horizontal: true
    });

  $('#shortcuts-examples').waypoint(function(direction) {
    $body.toggleClass('top-visible', direction === 'up');
  });

  $('#docs').waypoint(function(direction) {
    $body.toggleClass('left-visible', direction === 'left');
  }, { horizontal: true });
});