  'use strict'
  var Zepto = global.Zepto  //require('zepto')

  function ZeptoAdapter(element) {
    this.element = element
    this.$element = Zepto(element)
  }

  Zepto.each([
    'off',
    'on',
    'scrollLeft',
    'scrollTop'
  ], function(i, method) {
    ZeptoAdapter.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments)
      return this.$element[method].apply(this.$element, args)
    }
  })

  ZeptoAdapter.prototype.offset = function() {
    if (this.element !== this.element.window) {
      return this.$element.offset()
    }
  }

  // Adapted from https://gist.github.com/wheresrhys/5823198
  Zepto.each([
    'width',
    'height'
  ], function(i, dimension) {
    function createDimensionMethod($element, includeBorder) {
      return function(includeMargin) {
        var $element = this.$element
        var size = $element[dimension]()
        var sides = {
          width: ['left', 'right'],
          height: ['top', 'bottom']
        }

        Zepto.each(sides[dimension], function(i, side) {
          size += parseInt($element.css('padding-' + side), 10)
          if (includeBorder) {
            size += parseInt($element.css('border-' + side + '-width'), 10)
          }
          if (includeMargin) {
            size += parseInt($element.css('margin-' + side), 10)
          }
        })
        return size
      }
    }

    var innerMethod = Zepto.camelCase('inner-' + dimension)
    var outerMethod = Zepto.camelCase('outer-' + dimension)

    ZeptoAdapter.prototype[innerMethod] = createDimensionMethod(false)
    ZeptoAdapter.prototype[outerMethod] = createDimensionMethod(true)
  })

  Zepto.each([
    'extend',
    'inArray'
  ], function(i, method) {
    ZeptoAdapter[method] = Zepto[method]
  })

  ZeptoAdapter.isEmptyObject = function(obj) {
    /* eslint no-unused-vars: 0 */
    for (var name in obj) {
      return false
    }
    return true
  }

  module.exports = {
    name: 'zepto',
    Adapter: ZeptoAdapter
  }
