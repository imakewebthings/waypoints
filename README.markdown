# jQuery Waypoints

Waypoints is a small jQuery plugin that makes it easy to execute a function whenever you scroll to an element.

    $('.entry').waypoint(function() {
       alert('You have scrolled to an entry.');
    });

[Read the full documentation](http://imakewebthings.github.com/jquery-waypoints/#documentation) for more details on usage and customization.

## Examples

Waypoints can be used as a base for several common scroll-based UI patterns. Check out these examples of:

- [Infinite Scrolling](http://imakewebthings.github.com/jquery-waypoints/infinite-scroll)
- [Sticky Elements](http://imakewebthings.github.com/jquery-waypoints/sticky-elements)
- [Scroll Analytics](http://imakewebthings.github.com/jquery-waypoints/scroll-analytics)

## License

Copyright (c) 2011 Caleb Troughton
Dual licensed under the [MIT license](https://github.com/imakewebthings/jquery-waypoints/blob/master/MIT-license.txt) and [GPL license](https://github.com/imakewebthings/jquery-waypoints/blob/master/GPL-license.txt).

## Support

Waypoints has been tested to work with jQuery versions 1.4+ in IE6+, FF3+, Safari 4+, Chrome 6+.  Other browsers and jQuery versions may work fine, but this is all I've looked at so far.

Unit tests for Waypoints are written with [Jasmine](http://pivotal.github.com/jasmine/) and [jasmine-jquery](https://github.com/velesin/jasmine-jquery).  You can [run them here](http://imakewebthings.github.com/jquery-waypoints/test/). If any of the tests fail, please open an issue and include the browser used, operating system, and description of the failed test.</small>

## Changelog

### v1.1
- Moved the continuous option out of global settings and into the options
  object for individual waypoints.
- Added the context option, which allows for using waypoints within any
  scrollable element, not just the window.

### v1.0.2

- Moved scroll and resize handler bindings out of load.  Should play nicer with async loaders like Head JS and LABjs.
- Fixed a 1px off error when using certain % offsets.
- Added unit tests.

### v1.0.1

- Added $.waypoints('viewportHeight').
- Fixed iOS bug (using the new viewportHeight method).
- Added offset function alias: 'bottom-in-view'.

### v1.0

- Initial release.

## Known Todos

- Audit non-iOS mobile browsers.