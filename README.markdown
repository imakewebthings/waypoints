# jQuery Waypoints

Waypoints is a jQuery plugin that makes it easy to execute a function whenever you scroll to an element.

```js
$('.thing').waypoint(function() {
  alert('You have scrolled to a thing.');
});
```
If you're new to Waypoints, check out the [Get Started](http://imakewebthings.github.com/jquery-waypoints/#get-started) section.

[Read the full documentation](http://imakewebthings.github.com/jquery-waypoints/#docs) for more details on usage and customization.

## Shortcuts

In addition to the normal Waypoints script, extensions exist to make common UI patterns just a little easier to implement:

- [Infinite Scrolling](http://imakewebthings.github.com/jquery-waypoints/shortcuts/infinite-scroll)
- [Sticky Elements](http://imakewebthings.github.com/jquery-waypoints/shortcuts/sticky-elements)

## Examples

Waypoints can also be used as a base for your own custom UI patterns. Here are a few examples:

- [Scroll Analytics](http://imakewebthings.github.com/jquery-waypoints/examples/scroll-analytics)
- [Dial Controls](http://imakewebthings.github.com/jquery-waypoints/examples/dial-controls)

## License

Copyright (c) 2011-2012 Caleb Troughton
Licensed under the [MIT license](https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt).

## Support

Unit tests for Waypoints are written with [Jasmine](http://pivotal.github.com/jasmine/) and [jasmine-jquery](https://github.com/velesin/jasmine-jquery).  You can [run them here](http://imakewebthings.github.com/jquery-waypoints/test/). If any of the tests fail, please open an issue and include the browser used, operating system, and description of the failed test.