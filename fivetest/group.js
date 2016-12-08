var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
var expect = chai.expect
var Group = require('../source/group')()

function mockWaypoint (options) {
  return {
    trigger: sinon.spy(),
    continuous: true,
    ...options
  }
}

describe('Group', function () {
  beforeEach(function () {
    this.group = new Group({ axis: 'vertical', name: 'test' })
  })

  describe('#add', function () {
    it('adds to the waypoints array', function () {
      this.group.add(42)
      expect(this.group.waypoints).to.deep.equal([42])
    })
  })

  describe('#remove', function () {
    beforeEach(function () {
      this.group.add(42)
      this.group.add(321)
    })

    it('removes waypoint from array if it is included', function () {
      this.group.remove(42)
      expect(this.group.waypoints).to.deep.equal([321])
    })

    it('does nothing if waypoint is not in the group', function () {
      this.group.remove('not-in-group')
      expect(this.group.waypoints).to.include.members([42, 321])
    })
  })

  describe('#clearTriggerQueues', function () {
    beforeEach(function () {
      this.group.queueTrigger(1, 'up')
      this.group.queueTrigger(2, 'down')
      this.group.queueTrigger(3, 'left')
      this.group.queueTrigger(4, 'right')
      this.group.clearTriggerQueues()
    })

    it('sets all trigger queues to empty arrays', function () {
      expect(this.group.triggerQueues.up).to.be.empty
      expect(this.group.triggerQueues.down).to.be.empty
      expect(this.group.triggerQueues.left).to.be.empty
      expect(this.group.triggerQueues.right).to.be.empty
    })
  })

  describe('#queueTrigger', function () {
    it('adds specified waypoint to queue in specified direction', function () {
      this.group.queueTrigger(1, 'left')
      expect(this.group.triggerQueues.left).to.deep.equal([1])
      this.group.clearTriggerQueues()
    })

    it('throws if you try to queue in a non-existent direction', function () {
      expect(() => {
        this.group.queueTrigger(2, 'seaward')
      }).to.throw
    })
  })

  describe('#flushTriggers', function () {
    beforeEach(function () {
      this.downMocks = []
      this.upMocks = []
    })

    describe('with all continuous waypoints', function () {
      beforeEach(function () {
        for (var i = 1; i <= 3; i++) {
          this.downMocks.push(mockWaypoint({ triggerPoint: i }))
          this.upMocks.push(mockWaypoint({ triggerPoint: i }))
        }
        this.downMocks.forEach(mock => this.group.queueTrigger(mock, 'down'))
        this.upMocks.forEach(mock => this.group.queueTrigger(mock, 'up'))
        this.group.flushTriggers()
      })

      it('calls trigger on all queued waypoints', function () {
        this.downMocks.forEach(mock => {
          expect(mock.trigger).to.have.been.calledWith('down')
        })
        this.upMocks.forEach(mock => {
          expect(mock.trigger).to.have.been.calledWith('up')
        })
      })

      it('sorts forward directions by ascending triggerPoint', function () {
        for (var i = 0; i < this.downMocks.length - 1; i++) {
          let prevTrigger = this.downMocks[i].trigger
          let nextTrigger = this.downMocks[i + 1].trigger
          expect(prevTrigger).to.have.been.calledBefore(nextTrigger)
        }
      })

      it('sorts backward directions by descending triggerPoint', function () {
        for (var i = 0; i < this.upMocks.length - 1; i++) {
          let prevTrigger = this.upMocks[i].trigger
          let nextTrigger = this.upMocks[i + 1].trigger
          expect(prevTrigger).to.have.been.calledAfter(nextTrigger)
        }
      })
    })

    describe('with all non-continuous waypoints', function () {
      beforeEach(function () {
        for (var i = 1; i <= 3; i++) {
          let wp = mockWaypoint({ triggerPoint: i, continuous: false })
          this.downMocks.push(wp)
          this.group.queueTrigger(wp, 'down')
        }
        this.group.flushTriggers()
      })

      it('only triggers the last waypoint', function () {
        expect(this.downMocks[0].trigger).not.to.have.been.called
        expect(this.downMocks[1].trigger).not.to.have.been.called
        expect(this.downMocks[2].trigger).to.have.been.called
      })
    })

    describe('with mixed continuous, non-continuous', function () {
      beforeEach(function () {
        for (var i = 1; i <= 3; i++) {
          let wp = mockWaypoint({ triggerPoint: i, continuous: i === 1 })
          this.downMocks.push(wp)
          this.group.queueTrigger(wp, 'down')
        }
        this.group.flushTriggers()
      })

      it('triggers the last and any other continuous waypoints', function () {
        expect(this.downMocks[0].trigger).to.have.been.called
        expect(this.downMocks[1].trigger).not.to.have.been.called
        expect(this.downMocks[2].trigger).to.have.been.called
      })
    })
  })

  describe('#next', function () {
    beforeEach(function () {
      this.group.add(mockWaypoint({ triggerPoint: 2 }))
      this.group.add(mockWaypoint({ triggerPoint: 1 }))
      this.mocks = [...this.group.waypoints]
    })

    it('returns null if waypoint not in group', function () {
      expect(this.group.next(mockWaypoint({ triggerPoint: 3 }))).to.be.null
    })

    it('returns null if specified waypoint is last in group', function () {
      expect(this.group.next(this.mocks[0])).to.be.null
    })

    it('returns the next waypoint by trigger point', function () {
      expect(this.group.next(this.mocks[1])).to.equal(this.mocks[0])
    })
  })

  describe('#previous', function () {
    beforeEach(function () {
      this.group.add({ triggerPoint: 2 })
      this.group.add({ triggerPoint: 1 })
      this.mocks = [...this.group.waypoints]
    })

    it('returns null if waypoint not in group', function () {
      expect(this.group.previous({ triggerPoint: 3 })).to.be.null
    })

    it('returns null if specified waypoint is first in group', function () {
      expect(this.group.previous(this.mocks[1])).to.be.null
    })

    it('returns the previous waypoint by trigger point', function () {
      expect(this.group.previous(this.mocks[0])).to.equal(this.mocks[1])
    })
  })

  describe('#first', function () {
    it('returns the first waypoint in the group', function () {
      this.group.add({ triggerPoint: 2 })
      this.group.add({ triggerPoint: 1 })
      expect(this.group.first().triggerPoint).to.equal(1)
    })
  })

  describe('#last', function () {
    it('returns the last waypoint in the group', function () {
      this.group.add({ triggerPoint: 2 })
      this.group.add({ triggerPoint: 1 })
      expect(this.group.last().triggerPoint).to.equal(2)
    })
  })

  describe('findOrCreate', function () {
    it('returns existing groups by axis/name combination', function () {
      expect(Group.findOrCreate({
        axis: 'vertical',
        name: 'test'
      })).to.equal(this.group)
    })

    it('creates new groups if not found', function () {
      var newGroup = Group.findOrCreate({
        axis: 'horizontal',
        name: 'test'
      })
      expect(newGroup).to.be.an.instanceOf(Group)
      expect(newGroup).not.to.equal(this.group)
    })
  })
})
