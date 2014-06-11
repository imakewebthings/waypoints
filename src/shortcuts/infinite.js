(function() {
  var Infinite = function(options) {
    this.options = $.extend({}, Infinite.defaults, options)
    this.container = this.options.element
    if (this.options.container !== 'auto') {
      this.container = this.options.container
    }
    this.$container = $(this.container)
    this.$more = $(this.options.more)
    this.more = this.$more[0]

    if (this.more) {
      this.setupHandler()
      this.waypoint = new window.Waypoint(this.options)
    }
  }

  Infinite.prototype.destroy = function() {
    if (this.waypoint) {
      this.waypoint.destroy()
    }
  }

  /* Internal */
  Infinite.prototype.setupHandler = function() {
    this.options.handler = $.proxy(function(direction) {
      window.setTimeout($.proxy(function() {
        this.options.onBeforePageLoad()
        this.destroy()
        this.$container.addClass(this.options.loadingClass)

        $.get($(this.options.more).attr('href'), $.proxy(function(data) {
          var $data = $($.parseHTML(data))
          var $newMore = $data.find(this.options.more)

          this.$container.append($data.find(this.options.items))
          this.$container.removeClass(this.options.loadingClass)

          if (!$newMore.length) {
            $newMore = $data.filter(this.options.more)
          }
          if ($newMore.length) {
            this.$more.replaceWith($newMore)
            this.waypoint = new Waypoint(this.options)
          }
          else {
            this.$more.remove()
          }

          this.options.onAfterPageLoad()
        }, this), 0)
      }, this))
    }, this)
  }

  Infinite.defaults = {
    container: 'auto',
    items: '.infinite-item',
    more: '.infinite-more-link',
    offset: 'bottom-in-view',
    loadingClass: 'infinite-loading',
    onBeforePageLoad: $.noop,
    onAfterPageLoad: $.noop
  }

  window.Waypoint.Infinite = Infinite
})()
