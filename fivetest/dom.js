global.document = {
  documentElement: {
    clientHeight: 63,
    clientWidth: 42
  }
}
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
var expect = chai.expect
var DOM = require('../source/dom')()

function createDOM (options) {
  options = options || {}
  var element = {
    ownerDocument: {
      defaultView: {}
    },
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy(),
  }
  if (options.isWindow) {
    element.window = element
  }
  return new DOM(element)
}

describe('DOM', function () {
  beforeEach(function () {
    global.window.getComputedStyle = function () {
      return {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
      }
    }
  })

  describe('#innerHeight', function () {
    describe('when the element is a window', function () {
      beforeEach(function () {
        this.dom = createDOM({ isWindow: true })
      })

      describe('and window has an innerHeight', function () {
        beforeEach(function () {
          this.dom.element.innerHeight = 42
        })

        it('returns the innerHeight', function () {
          expect(this.dom.innerHeight()).to.equal(42)
        })
      })

      describe('and innerHeight does not exist', function () {
        it('returns the document client height', function () {
          expect(this.dom.innerHeight()).to.equal(63)
        })
      })
    })

    describe('when the element is not a window', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.clientHeight = 42
      })

      it('returns the client height of the element', function () {
        expect(this.dom.innerHeight()).to.equal(42)
      })
    })
  })

  describe('#innerWidth', function () {
    describe('when the element is a window', function () {
      beforeEach(function () {
        this.dom = createDOM({ isWindow: true })
        this.dom.element.innerWidth = 42
      })

      it('returns the innerWidth of the element', function () {
        expect(this.dom.innerWidth()).to.equal(42)
      })
    })

    describe('when the element is not a window', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.clientWidth = 63
      })

      it('returns the clientWidth of the element', function () {
        expect(this.dom.innerWidth()).to.equal(63)
      })
    })
  })

  describe('#outerHeight', function () {
    beforeEach(function () {
      this.dom = createDOM({ isWindow: true })
      this.dom.element.innerHeight = 42
    })

    it('returns the same as innerHeight', function () {
      expect(this.dom.outerHeight()).to.equal(42)
    })

    describe('when the element is not a window and margin is included', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.clientHeight = 63
      })

      it('adds computed margin to innerHeight', function () {
        expect(this.dom.outerHeight(true)).to.equal(83)
      })
    })
  })

  describe('#outerWidth', function () {
    beforeEach(function () {
      this.dom = createDOM({ isWindow: true })
      this.dom.element.innerWidth = 42
    })

    it('returns the same as innerWidth', function () {
      expect(this.dom.outerWidth()).to.equal(42)
    })

    describe('when the element is not a window and margin is included', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.clientWidth = 63
      })

      it('adds computed margin to innerWidth', function () {
        expect(this.dom.outerWidth(true)).to.equal(83)
      })
    })
  })

  describe('#scrollLeft', function () {
    describe('when the element is a window', function () {
      beforeEach(function () {
        this.dom = createDOM({ isWindow: true })
        this.dom.element.pageXOffset = 42
      })

      it('returns the pageXOffset of the element', function () {
        expect(this.dom.scrollLeft()).to.equal(42)
      })
    })

    describe('when the element is not a window', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.scrollLeft = 63
      })

      it('returns the scrollLeft of the element', function () {
        expect(this.dom.scrollLeft()).to.equal(63)
      })
    })
  })

  describe('#scrollTop', function () {
    describe('when the element is a window', function () {
      beforeEach(function () {
        this.dom = createDOM({ isWindow: true })
        this.dom.element.pageYOffset = 42
      })

      it('returns the pageYOffset of the element', function () {
        expect(this.dom.scrollTop()).to.equal(42)
      })
    })

    describe('when the element is not a window', function () {
      beforeEach(function () {
        this.dom = createDOM()
        this.dom.element.scrollTop = 63
      })

      it('returns the scrollTop of the element', function () {
        expect(this.dom.scrollTop()).to.equal(63)
      })
    })
  })

  describe('#on', function () {
    beforeEach(function () {
      this.dom = createDOM()
      this.handler = function () {}
    })

    describe('with an unnamespaced event type', function () {
      beforeEach(function () {
        this.dom.on('event', this.handler)
      })

      it('calls addEventListener with event and handler', function () {
        const addEventListener = this.dom.element.addEventListener
        expect(addEventListener).to.have.been.calledWith('event', this.handler)
      })
    })

    describe('with a namespaced event type',function () {
      beforeEach(function () {
        this.dom.on('event.namespace', this.handler)
      })


      it('calls addEventListener with event and handler', function () {
        const addEventListener = this.dom.element.addEventListener
        expect(addEventListener).to.have.been.calledWith('event', this.handler)
      })
    })
  })

  describe('#off', function () {
    beforeEach(function () {
      this.dom = createDOM()
      this.handler = function () {}
      this.dom.on('event1.namespace1', function () {})
      this.dom.on('event1.namespace1', this.handler)
      this.dom.on('event1.namespace2', function () {})
      this.dom.on('event2.namespace1', function () {})
    })

    describe('with an event type and namespace', function () {
      beforeEach(function () {
        this.dom.off('event1.namespace1')
      })

      it('removes all handlers of that event type and namespace', function () {
        expect(this.dom.element.removeEventListener).to.have.callCount(2)
      })
    })

    describe('with an event type and no namespace', function () {
      beforeEach(function () {
        this.dom.off('event1')
      })

      it('removes all handlers of that event type', function () {
        expect(this.dom.element.removeEventListener).to.have.callCount(3)
      })
    })

    describe('with a namespace and no event type', function () {
      beforeEach(function () {
        this.dom.off('.namespace1')
      })

      it('removes all handlers of that namespace', function () {
        expect(this.dom.element.removeEventListener).to.have.callCount(3)
      })
    })

    describe('with a specific handler to remove', function () {
      beforeEach(function () {
        this.dom.off('event1', this.handler)
      })

      it('removes only the specified handler', function () {
        expect(this.dom.element.removeEventListener).to.have.been.calledWith(this.handler)
      })
    })

    describe('when no handlers of the event type have been added', function () {
      beforeEach(function () {
        this.dom.off('event999')
      })

      it('does nothing', function () {
        expect(this.dom.element.removeEventListener).to.not.have.been.called
      })
    })

    describe('when the specified namespace has no handlers', function () {
      beforeEach(function () {
        this.dom.off('.namespace999')
      })

      it('does nothing', function () {
        expect(this.dom.element.removeEventListener).to.not.have.been.called
      })
    })
  })

  describe('#offset', function () {
    beforeEach(function () {
      this.dom = createDOM()
      this.dom.element.ownerDocument.documentElement = {
        clientTop: 3,
        clientLeft: 1
      }
      this.dom.window.pageYOffset = 7
      this.dom.window.pageXOffset = 9
      this.dom.element.getBoundingClientRect = function () {
        return {
          top: 20,
          left: 10
        }
      }
    })

    it('returns calculated top value', function () {
      expect(this.dom.offset().top).to.equal(24)
    })

    it('returns calculated left value', function () {
      expect(this.dom.offset().left).to.equal(18)
    })

    describe('when element has no owner document', function () {
      beforeEach(function () {
        this.dom.element.ownerDocument = null
      })

      it('returns null', function () {
        expect(this.dom.offset()).to.be.null
      })
    })
  })

  describe('.viewportHeight', function () {
    describe('when window innerHeight property exists', function () {
      beforeEach(function () {
        global.window.innerHeight = 1
      })

      it('returns window innerHeight', function () {
        expect(DOM.viewportHeight()).to.equal(1)
      })
    })

    describe('when window does not have innerHeight property', function () {
      beforeEach(function () {
        global.window.innerHeight = null
      })

      it('returns document clientHeight', function () {
        expect(DOM.viewportHeight()).to.equal(63)
      })
    })
  })

  describe('.viewportWidth', function () {
    it('returns document clientWidth', function () {
      expect(DOM.viewportWidth()).to.equal(42)
    })
  })
})
