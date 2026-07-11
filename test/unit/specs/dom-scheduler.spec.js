import domScheduler, { DomScheduler } from 'element-ui/src/utils/dom-scheduler';

describe('Utils:DomScheduler', () => {
  let scheduler;
  let frames;
  let frameId;

  const createVm = uid => ({
    _uid: uid,
    $options: { name: 'SchedulerTest' },
    constructor: { config: {} }
  });

  beforeEach(() => {
    frames = [];
    frameId = 0;
    scheduler = new DomScheduler();
    scheduler._requestFrame = callback => {
      frames.push({ id: ++frameId, callback });
      return frameId;
    };
    scheduler._cancelFrame = id => {
      frames = frames.filter(frame => frame.id !== id);
    };
  });

  const flushFrame = () => frames.shift().callback();

  it('exposes one browser-global instance', () => {
    expect(window.__GLOBAL_DOM_SCHEDULER__).to.equal(domScheduler);
  });

  it('runs every read before any write', () => {
    const calls = [];
    [createVm(1), createVm(2)].forEach(vm => {
      scheduler.register({
        vm,
        read: () => calls.push(`read-${vm._uid}`),
        write: () => calls.push(`write-${vm._uid}`)
      });
    });

    flushFrame();
    expect(calls).to.deep.equal(['read-1', 'read-2', 'write-1', 'write-2']);
  });

  it('keeps only the latest task for a component in one frame', () => {
    const vm = createVm(1);
    const oldRead = sinon.spy();
    const latestRead = sinon.stub().returns(42);
    const latestWrite = sinon.spy();

    scheduler.register({ vm, read: oldRead, write: sinon.spy() });
    scheduler.register({ vm, read: latestRead, write: latestWrite });
    expect(frames).to.have.length(1);

    flushFrame();
    expect(oldRead).not.to.have.been.called;
    expect(latestRead).to.have.been.calledOnce;
    expect(latestWrite).to.have.been.calledWith(42);
  });

  it('defers tasks registered while flushing to another frame', () => {
    const calls = [];
    const secondVm = createVm(2);
    scheduler.register({
      vm: createVm(1),
      read: () => {
        calls.push('first-read');
        scheduler.register({
          vm: secondVm,
          read: () => calls.push('second-read'),
          write: () => calls.push('second-write')
        });
      },
      write: () => calls.push('first-write')
    });

    flushFrame();
    expect(calls).to.deep.equal(['first-read', 'first-write']);
    expect(frames).to.have.length(1);
    flushFrame();
    expect(calls).to.deep.equal(['first-read', 'first-write', 'second-read', 'second-write']);
  });

  it('cancels an empty frame after deregistering', () => {
    const vm = createVm(1);
    scheduler.register({ vm, read: sinon.spy(), write: sinon.spy() });
    scheduler.deregister(vm);

    expect(frames).to.have.length(0);
    expect(scheduler.rafId).to.equal(null);
  });

  it('skips destroyed components and isolates task errors', () => {
    const errorHandler = sinon.spy();
    const failedVm = createVm(1);
    failedVm.constructor.config.errorHandler = errorHandler;
    const destroyedVm = createVm(2);
    const destroyedRead = sinon.spy();

    scheduler.register({
      vm: failedVm,
      read: () => { throw new Error('read failed'); },
      write: sinon.spy()
    });
    scheduler.register({ vm: destroyedVm, read: destroyedRead, write: sinon.spy() });
    destroyedVm._isDestroyed = true;
    flushFrame();

    expect(errorHandler).to.have.been.calledOnce;
    expect(errorHandler.firstCall.args[2]).to.equal('DomScheduler [Read Phase]');
    expect(destroyedRead).not.to.have.been.called;
  });
});
