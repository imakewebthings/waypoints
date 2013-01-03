# jQuery Waypoints

Waypoints is a small jQuery plugin that makes it easy to execute a function whenever you scroll to an element.

```js
$('.entry').waypoint(function() {
  alert('You have scrolled to an entry.');
});
```

[Read the full documentation](http://imakewebthings.github.com/jquery-waypoints/#documentation) for more details on usage and customization.

## Examples

Waypoints can be used as a base for several common scroll-based UI patterns. Check out these examples of:

- [Infinite Scrolling](http://imakewebthings.github.com/jquery-waypoints/infinite-scroll)
- [Sticky Elements](http://imakewebthings.github.com/jquery-waypoints/sticky-elements)
- [Scroll Analytics](http://imakewebthings.github.com/jquery-waypoints/scroll-analytics)
- [Dial Controls](http://imakewebthings.github.com/jquery-waypoints/dial-controls)

## License

Copyright (c) 2011-2012 Caleb Troughton
Dual licensed under the [MIT license](https://github.com/imakewebthings/jquery-waypoints/blob/master/MIT-license.txt) and [GPL license](https://github.com/imakewebthings/jquery-waypoints/blob/master/GPL-license.txt).

## Support

Waypoints has been tested to work with jQuery versions 1.4.3+ in IE6+, FF3+, Safari 4+, Chrome 6+, and Opera 11+.  Other browsers and jQuery versions may work fine, but this is all I've looked at so far.

Unit tests for Waypoints are written with [Jasmine](http://pivotal.github.com/jasmine/) and [jasmine-jquery](https://github.com/velesin/jasmine-jquery).  You can [run them here](http://imakewebthings.github.com/jquery-waypoints/test/). If any of the tests fail, please open an issue and include the browser used, operating system, and description of the failed test.