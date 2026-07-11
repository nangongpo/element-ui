/**
 * Vue 2 DOM read/write scheduler.
 *
 * A component owns at most one task in a frame. All reads are completed before
 * any write starts; tasks registered while a frame is flushing are deferred to
 * the next frame.
 */
/* global Map */

const isAlive = vm => vm && !vm._isDestroyed && !vm._isBeingDestroyed && !vm.__is_unmounted__;

export class DomScheduler {
  constructor() {
    this.readQueue = new Map();
    this.rafId = null;
    this.Vue = null;
  }

  register(task) {
    if (typeof window === 'undefined' || !task || !isAlive(task.vm)) return;
    if (typeof task.read !== 'function' || typeof task.write !== 'function') return;

    const uid = task.vm._uid;
    if (typeof uid === 'undefined') return;

    // Keep the latest request without changing the component's queue position.
    this.readQueue.set(uid, {
      id: uid,
      vm: task.vm,
      read: task.read,
      write: task.write
    });

    this._schedule();
  }

  deregister(vm) {
    if (!vm || typeof vm._uid === 'undefined') return;

    this.readQueue.delete(vm._uid);
    if (this.readQueue.size === 0 && this.rafId !== null) {
      this._cancelFrame(this.rafId);
      this.rafId = null;
    }
  }

  _schedule() {
    if (this.rafId !== null || this.readQueue.size === 0) return;
    this.rafId = this._requestFrame(() => this._flush());
  }

  _flush() {
    const currentTasks = Array.from(this.readQueue.values());
    this.readQueue.clear();
    this.rafId = null;

    const results = currentTasks.map(item => {
      if (!isAlive(item.vm)) return undefined;
      try {
        return item.read();
      } catch (error) {
        this._handleError(error, item.vm, 'DomScheduler [Read Phase]');
        return undefined;
      }
    });

    currentTasks.forEach((item, index) => {
      if (!isAlive(item.vm)) return;
      try {
        item.write(results[index]);
      } catch (error) {
        this._handleError(error, item.vm, 'DomScheduler [Write Phase]');
      }
    });

    // register() calls made during this flush belong to a new frame.
    this._schedule();
  }

  _requestFrame(callback) {
    return window.requestAnimationFrame(callback);
  }

  _cancelFrame(id) {
    window.cancelAnimationFrame(id);
  }

  _handleError(error, vm, info) {
    const Vue = this.Vue || (vm && vm.constructor);
    const errorHandler = Vue && Vue.config && Vue.config.errorHandler;
    if (typeof errorHandler === 'function') {
      try {
        errorHandler.call(null, error, vm, info);
        return;
      } catch (handlerError) {
        console.error(handlerError);
      }
    }

    console.error(`[${info}]`, error);
  }

  install(Vue) {
    if (!Vue || Vue.__domSchedulerInstalled__) return;
    Vue.__domSchedulerInstalled__ = true;
    this.Vue = Vue;

    Vue.mixin({
      beforeDestroy() {
        this.__is_unmounted__ = true;
        domScheduler.deregister(this);
      }
    });
  }
}

let domScheduler;
if (typeof window !== 'undefined') {
  domScheduler = window.__GLOBAL_DOM_SCHEDULER__;
  if (!domScheduler || !(domScheduler.readQueue instanceof Map)) {
    domScheduler = new DomScheduler();
    window.__GLOBAL_DOM_SCHEDULER__ = domScheduler;
  }
} else {
  domScheduler = new DomScheduler();
}

export default domScheduler;
