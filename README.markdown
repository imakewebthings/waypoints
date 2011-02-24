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

Waypoints has been tested* to work with jQuery versions 1.4+ in IE6+, FF3+, Safari 4+, Chrome 6+.  Other browsers and jQuery versions may work fine, but this is all I've look at so far.

<small>* Tested in this case by my own poking around and not finding anything wrong...yet.  Proper QUnit tests are in the works.</small>

## Changelog

- **v1.0**: Initial release.

## Known Todos

- Proper QUnit tests.
- Audit iOS and other mobile browsers.