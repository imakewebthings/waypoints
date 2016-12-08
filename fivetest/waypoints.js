var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
var expect = chai.expect
var WaypointFactory = require('../source/waypoint')
var DOM, Context, Group, Waypoint

function createWaypoint (options) {
  return new Waypoint(Object.assign({
    element: {},
    handler: function () {}
  }, options))
}

describe('Waypoint', function () {
  beforeEach(function () {
    this.dom = {}
    this.context = {
      add: sinon.spy(),
      remove: sinon.spy(),
      refresh: sinon.spy()
    }
    this.group = {
      add: sinon.spy(),
      remove: sinon.spy()
    }
    DOM = sinon.stub().returns(this.dom)
    Context = {
      findOrCreateByElement: sinon.stub().returns(this.context),
      refreshAll: sinon.spy()
    }
    Group = {
      findOrCreate: sinon.stub().returns(this.group)
    }
    Waypoint = WaypointFactory(DOM, Context, Group)
  })

  describe('#destroy', function () {
    beforeEach(function () {
      this.waypoint = createWaypoint()
      this.waypoint.destroy()
    })

    it('removes the waypoint from its context', function () {
      expect(this.context.remove).to.have.been.calledWith(this.waypoint)
    })

    it('removes the waypoint from its group', function () {
      expect(this.context.remove).to.have.been.calledWith(this.waypoint)
    })
  })

  describe('#disable', function () {
    beforeEach(function () {
      this.waypoint = createWaypoint()
      this.returnValue = this.waypoint.disable()
    })

    it('sets the enabled flag on the element to false', function () {
      expect(this.waypoint.enabled).to.be.false
    })

    it('returns the waypoint for chaining', function () {
      expect(this.returnValue).to.equal(this.waypoint)
    })
  })

  describe('#enable', function () {
    beforeEach(function () {
      this.waypoint = createWaypoint()
      this.waypoint.disable()
      this.returnValue = this.waypoint.enable()
    })

    it('refreshes the context to ensure an accurate trigger point', function () {
      expect(this.context.refresh).to.have.been.called
    })

    it('sets the enabled flag on the element to true', function () {
      expect(this.waypoint.enabled).to.be.true
    })

    it('returns the waypoint for chaining', function () {
      expect(this.returnValue).to.equal(this.waypoint)
    })
  })

  describe('#next', function () {
    it('needs specs')
  })

  describe('#previous', function () {
    it('needs specs')
  })

  describe('#trigger', function () {
    it('needs specs')
  })

  describe('#shouldScrollTrigger', function () {
    it('needs specs')
  })

  describe('#refreshTriggerPoint', function () {
    it('needs specs')
  })

  describe('.destroyAll', function () {
    it('needs specs')
  })

  describe('.disableAll', function () {
    it('needs specs')
  })

  describe('.enableAll', function () {
    it('needs specs')
  })

  describe('.refreshAll', function () {
    it('needs specs')
  })

  describe('.viewportHeight', function () {
    it('needs specs')
  })

  describe('.viewportWidth', function () {
    it('needs specs')
  })
})
