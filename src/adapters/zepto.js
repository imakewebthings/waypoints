(function() {
  var $ = Zepto

  var ZeptoAdapter = function(element) {
    this.element = element
    this.$element = $(element)
  }

  $.each([
    'height',
    'off',
    'on',
    'scrollLeft',
    'scrollTop',
    'width'
  ], function(i, method) {
    ZeptoAdapter.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments)
      return this.$element[method].apply(this.$element, args)
    }
  })

  ZeptoAdapter.prototype.offset = function() {
    if (this.element != this.element.window) {
      return this.$element.offset()
    }
  }

  $.each([
    'width',
    'height'
  ], function(i, dimension) {
    var method = $.camelCase('outer-' + dimension)

    ZeptoAdapter.prototype[method] = function(includeMargin) {
      var size = this.$element[dimension]()
      var sides = {
        width: ['left', 'right'],
        height: ['top', 'bottom']
      }
      if (includeMargin) {
        $.each(sides[dimension], $.proxy(function(i, side) {
          size += parseInt(this.$element.css('margin-' + side), 10)
        }, this))
      }
      return size
    }
  })

  $.each([
    'extend',
    'inArray',
  ], function(i, method) {
    ZeptoAdapter[method] = $[method]
  })

  ZeptoAdapter.isEmptyObject = function(obj) {
    for (var name in obj) {
      return false
    }
    return true
  }

  window.Waypoint.adapters.push({
    name: 'zepto',
    Adapter: ZeptoAdapter
  })
  window.Waypoint.Adapter = ZeptoAdapter
})()
