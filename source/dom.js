module.exports = function () {
  return class DOM {
    constructor (element) {
      this.element = element
      this.handlers = {}
      this.isWindow = element.window === element
      this.window = this.isWindow ? element : element.ownerDocument.defaultView
    }

    innerHeight () {
      if (this.isWindow) {
        return this.element.innerHeight || document.documentElement.clientHeight
      }
      return this.element.clientHeight
    }

    innerWidth () {
      if (this.isWindow) {
        return this.element.innerWidth
      }
      return this.element.clientWidth
    }

    outerHeight (includeMargin) {
      var height = this.innerHeight()

      if (includeMargin && !this.isWindow) {
        let computedStyle = window.getComputedStyle(this.element)
        height += parseInt(computedStyle.marginTop, 10)
        height += parseInt(computedStyle.marginBottom, 10)
      }

      return height
    }

    outerWidth (includeMargin) {
      var width = this.innerWidth()

      if (includeMargin && !this.isWindow) {
        let computedStyle = window.getComputedStyle(this.element)
        width += parseInt(computedStyle.marginLeft, 10)
        width += parseInt(computedStyle.marginRight, 10)
      }

      return width
    }

    scrollLeft () {
      return this.element[this.isWindow ? 'pageXOffset' : 'scrollLeft']
    }

    scrollTop () {
      return this.element[this.isWindow ? 'pageYOffset' : 'scrollTop']
    }

    on (event, handler) {
      const [eventType, namespace='__default'] = event.split('.')
      const nsHandlers = this.handlers[namespace] = this.handlers[namespace] || {}
      const nsTypeList = nsHandlers[eventType] = nsHandlers[eventType] || []

      nsTypeList.push(handler)
      this.element.addEventListener(eventType, handler)
    }

    off (event, handler) {
      const [eventType, namespace] = event.split('.')

      if (namespace && this.handlers[namespace] && eventType) {
        this.removeListeners(this.handlers[namespace][eventType], handler)
        this.handlers[namespace][eventType] = []
      } else if (eventType) {
        for (var ns in this.handlers) {
          this.removeListeners(this.handlers[ns][eventType] || [], handler)
          this.handlers[ns][eventType] = []
        }
      } else if (namespace && this.handlers[namespace]) {
        for (var type in this.handlers[namespace]) {
          this.removeListeners(this.handlers[namespace][type], handler)
        }
        this.handlers[namespace] = {}
      }
    }

    removeListeners (listeners, handler) {
      listeners.forEach((listener) => {
        if (!handler || handler === listener) {
          this.element.removeEventListener(listener)
        }
      })
    }

    /* Adapted from jQuery 1.x offset() */
    offset () {
      if (!this.element.ownerDocument) {
        return null
      }

      const documentElement = this.element.ownerDocument.documentElement
      const rect = this.element.getBoundingClientRect()

      return {
        top: rect.top + this.window.pageYOffset - documentElement.clientTop,
        left: rect.left + this.window.pageXOffset - documentElement.clientLeft
      }
    }

    static viewportHeight () {
      return window.innerHeight || document.documentElement.clientHeight
    }

    static viewportWidth () {
      return document.documentElement.clientWidth
    }
  }
}
