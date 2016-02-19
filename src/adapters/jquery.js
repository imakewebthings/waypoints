  'use strict'

  var jquery = global.jQuery  //require('jquery')

  function JQueryAdapter(element) {
    this.$element = jquery(element)
  }

  jquery.each([
    'innerHeight',
    'innerWidth',
    'off',
    'offset',
    'on',
    'outerHeight',
    'outerWidth',
    'scrollLeft',
    'scrollTop'
  ], function(i, method) {
    JQueryAdapter.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments)
      return this.$element[method].apply(this.$element, args)
    }
  })

  jquery.each([
    'extend',
    'inArray',
    'isEmptyObject'
  ], function(i, method) {
    JQueryAdapter[method] = jquery[method]
  })

  module.exports = {
    name: 'jquery',
    Adapter: JQueryAdapter
  }
