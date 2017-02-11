(function() {
  'use strict'

  var $ = window.jQuery
  var Waypoint = window.Waypoint
  var timesLoaded = 0

  /* http://imakewebthings.com/waypoints/shortcuts/infinite-scroll */
  function Infinite(options) {
    this.options = $.extend({}, Infinite.defaults, options)
    this.container = this.options.element
    if (this.options.container !== 'auto') {
      this.container = this.options.container
    }
    this.$container = $(this.container)
    this.$more = $(this.options.more)

    if (this.$more.length) {
      this.setupHandler()
      this.waypoint = new Waypoint(this.options)
    }
  }

  /* Private */
  Infinite.prototype.resetInfiniteCounter = function(){
    timesLoaded = 0
  }

  Infinite.prototype.setupHandler = function() {
    this.options.handler = $.proxy(function() {
      if(this.options.pauseEvery && timesLoaded>this.options.pauseEvery-1){
        this.waypoint.disable()
        return null
      }
      this.options.onBeforePageLoad()
      this.destroy()
      this.$container.addClass(this.options.loadingClass)

      $.get($(this.options.more).attr('href'), $.proxy(function(data) {
        var $data = $($.parseHTML(data))
        var $newMore = $data.find(this.options.more)
        var $continueButton = $data.find(this.options.continueButton)

        var $items = $data.find(this.options.items)
        if (!$items.length) {
          $items = $data.filter(this.options.items)
        }

        this.$container.append($items)
        this.$container.removeClass(this.options.loadingClass)

        if (!$newMore.length) {
          $newMore = $data.filter(this.options.more)
        }
        if ($newMore.length) {
          this.$more.replaceWith($newMore)
          this.$more = $newMore
          // Allows to pause and load under demand, x links n times
          if(this.options.pauseEvery && timesLoaded>=this.options.pauseEvery-1){
            $continueButton.show()
            $continueButton.unbind()

            $continueButton.click(function(){
              infinite.resetInfiniteCounter()
              infinite.waypoint.enable()
              infinite.waypoint.trigger()
              $continueButton.remove()
            })
          }else{
            $continueButton.unbind()
            $continueButton.remove()
          }

          this.waypoint = new Waypoint(this.options)
        }
        else {
          this.$more.remove()
        }

        this.options.onAfterPageLoad($items)
        timesLoaded++
      }, this))

    }, this)
  }

  /* Public */
  Infinite.prototype.destroy = function() {
    if (this.waypoint) {
      this.waypoint.destroy()
    }
  }

  Infinite.defaults = {
    container: 'auto',
    items: '.infinite-item',
    more: '.infinite-more-link',
    offset: 'bottom-in-view',
    pauseEvery: null,
    continueButton: '.infinite-continue-button',
    loadingClass: 'infinite-loading',
    onBeforePageLoad: $.noop,
    onAfterPageLoad: $.noop
  }

  Waypoint.Infinite = Infinite
}())
