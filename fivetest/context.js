global.window = {
  setTimeout: function (f) { f() },
  location: {}
}

var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
var expect = chai.expect
var DOM = require('../source/dom')()
sinon.stub(DOM.prototype)
var Context = require('../source/context')(DOM)

function mockWaypoint (options = {}) {
  return {
    axis: 'vertical',
    key: 'key',
    shouldScrollTrigger: sinon.stub(),
    refreshTriggerPoint: sinon.stub(),
    group: {
      id: 'default',
      queueTrigger: sinon.spy(),
      flushTriggers: sinon.spy()
    },
    ...options
  }
}

function mockElement (options = {}) {
  var element = {
    ownerDocument: {}
  }
  if (options.isWindow) {
    element.window = element
  }
  return element
}

describe('Context', function () {
  beforeEach(function () {
    this.context = new Context(mockElement({ isWindow: true }))
  })

  describe('scrolling', function () {
    beforeEach(function () {
      this.context.dom.on = function (_, f) { f() }
      this.wp = mockWaypoint({ key: 'wp1' })
      this.context.add(this.wp)
      this.wp.shouldScrollTrigger.reset()
    })

    describe('when throttle is closed', function () {
      it('does not handle scroll', function () {
        this.context.didScroll = true
        this.context.createThrottledScrollHandler()
        expect(this.wp.shouldScrollTrigger).not.to.have.been.called
      })
    })

    describe('when throttle is open', function () {
      beforeEach(function () {
        this.context.createThrottledScrollHandler()
      })

      it('handles a scroll', function () {
        expect(this.wp.shouldScrollTrigger).to.have.been.calledOnce
      })
    })

    describe('when scrolling triggers forward', function () {
      beforeEach(function () {
        this.wp.shouldScrollTrigger.returns('down')
        this.context.createThrottledScrollHandler()
      })

      it('queues waypoint for trigger with its group', function () {
        expect(this.wp.group.queueTrigger).to.have.been.calledWith(this.wp, 'down')
      })

      it('flushes triggered groups', function () {
        expect(this.wp.group.flushTriggers).to.have.been.calledOnce
      })
    })

    describe('when scrolling triggers backward', function () {
      beforeEach(function () {
        this.wp.shouldScrollTrigger.returns('up')
        this.context.createThrottledScrollHandler()
      })

      it('queues waypoint for trigger with its group', function () {
        expect(this.wp.group.queueTrigger).to.have.been.calledWith(this.wp, 'up')
      })
    })
  })

  describe('resizing', function () {
    beforeEach(function () {
      this.context.dom.on = function (_, f) { f() }
      this.wp = mockWaypoint({ key: 'wp1' })
      this.context.add(this.wp)
      this.wp.refreshTriggerPoint.reset()
    })

    describe('when throttle is closed', function () {
      it('does not handle resize', function () {
        this.context.didResize = true
        this.context.createThrottledResizeHandler()
        expect(this.wp.refreshTriggerPoint).not.to.have.been.called
      })
    })

    describe('when throttle is open', function () {
      beforeEach(function () {
        this.context.createThrottledResizeHandler()
      })

      it('handles a resize', function () {
        expect(this.wp.refreshTriggerPoint).to.have.been.calledOnce
      })
    })
  })

  describe('#add', function () {
    beforeEach(function () {
      this.wp = mockWaypoint({ key: 'wp1' })
      this.context.add(this.wp)
    })

    it('adds specified waypoint to list of waypoints', function () {
      expect(this.context.waypoints.vertical.wp1).to.equal(this.wp)
    })

    it('calculates trigger point through refresh', function () {
      expect(this.wp.refreshTriggerPoint).to.have.been.calledOnce
    })
  })

  describe('#remove', function () {
    beforeEach(function () {
      this.wp = mockWaypoint({ key: 'wp1' })
      this.context.add(this.wp)
    })

    it('removes specified waypoint from list of waypoints', function () {
      this.context.remove(this.wp)
      expect(this.context.waypoints.vertical).to.be.empty
    })

    describe('when the remove empties a non-window context', function () {
      beforeEach(function () {
        this.context.dom.isWindow = false
        this.context.remove(this.wp)
      })

      it('removes all event listeners', function () {
        expect(this.context.dom.off).to.have.been.calledWith('.waypoints')
      })

      it('deletes the context', function () {
        expect(Context.findByElement(this.context.element)).to.be.undefined
      })
    })

    describe('when other waypoints remain in the context', function () {
      beforeEach(function () {
        this.context.dom.isWindow = false
        this.context.add(mockWaypoint({ key: 'wp2' }))
        this.context.remove(this.wp)
      })

      it('does not delete the context', function () {
        expect(Context.findByElement(this.context.element)).to.be.instanceOf(Context)
      })
    })
  })

  describe('#destroy', function () {
    beforeEach(function () {
      this.waypoints = [
        mockWaypoint({
          key: 'wp1',
          destroy: sinon.spy()
        }),
        mockWaypoint({
          key: 'wp2',
          axis: 'horizontal',
          destroy: sinon.spy()
        })
      ]
      this.waypoints.forEach(wp => this.context.add(wp))
      this.context.destroy()
    })

    it('calls destroy on all its waypoints', function () {
      this.waypoints.forEach(wp => expect(wp.destroy).to.have.been.calledOnce)
    })
  })

  describe('#refresh', function () {
    beforeEach(function () {
      this.wp = mockWaypoint({ key: 'wp1' })
      this.context.add(this.wp)
    })

    describe('when refresh causes a forward waypoint trigger', function () {
      beforeEach(function () {
        this.wp.refreshTriggerPoint.returns('down')
        this.context.refresh()
      })

      it('queues the waypoint for trigger', function () {
        expect(this.wp.group.queueTrigger).to.have.been.calledWith(this.wp, 'down')
      })

      it('flushes triggered groups', function () {
        expect(this.wp.group.flushTriggers).to.have.been.calledOnce
      })
    })

    describe('when refresh causes a backward waypoint trigger', function () {
      beforeEach(function () {
        this.wp.refreshTriggerPoint.returns('up')
        this.context.refresh()
      })

      it('queues the waypoint for trigger', function () {
        expect(this.wp.group.queueTrigger).to.have.been.calledWith(this.wp, 'up')
      })
    })
  })

  describe ('static findOrCreateByElement', function () {
    it('returns existing context if it exists', function () {
      var context = Context.findOrCreateByElement(this.context.element)
      expect(context).to.equal(this.context)
    })

    it('creates a new context if one does not exist for element', function () {
      var context = Context.findOrCreateByElement(mockElement())
      expect(context).to.be.an.instanceOf(Context)
      expect(context).not.to.equal(this.context)
    })
  })

  describe('static refreshAll', function () {
    beforeEach(function () {
      this.context.refresh = sinon.spy()
      Context.refreshAll()
    })

    it('calls refresh on all contexts', function () {
      expect(this.context.refresh).to.have.been.calledOnce
    })
  })
})
