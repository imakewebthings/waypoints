// Generated by CoffeeScript 1.4.0

/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.2
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery', 'waypoints'], factory);
    } else {
      return factory(root.jQuery);
    }
  })(this, function($) {
    var defaults, options, wrap;
    defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'stuck'
    };
    options = {};
    wrap = function($elements, options) {
      $elements.wrap(options.wrapper);
      $elements.each(function() {
        var $this;
        $this = $(this);
        $this.parent().height($this.outerHeight());
        return true;
      });
      return $elements.parent();
    };
    $.waypoints('extendFn', 'sticky', function(opt) {
      var $wrap, originalHandler;
      options = $.extend({}, $.fn.waypoint.defaults, defaults, opt);
      $wrap = wrap(this, options);
      originalHandler = options.handler;
      options.handler = function(direction) {
        var $sticky, shouldBeStuck;
        $sticky = $(this).children(':first');
        shouldBeStuck = direction === 'down' || direction === 'right';
        $sticky.toggleClass(options.stuckClass, shouldBeStuck);
        if (originalHandler != null) {
          return originalHandler.call(this, direction);
        }
      };
      $wrap.waypoint(options);
      return this;
    });
    return $.waypoints('extendFn', 'unsticky', function() {
      var $this;
      $this = $(this);
      $this.parent().waypoint('destroy');
      $this.unwrap();
      return $this.removeClass(options.stuckClass);
    });
  });

}).call(this);
