const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function runMicroTask(callback) {
  if (globalThis.process && globalThis.process.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    const tempElement = document.createElement("p");
    const tempObserver = new MutationObserver(callback);
    tempObserver.observe(tempElement, {
      childList: true,
    });
    tempElement.innerHTML = "1";
  } else {
    setTimeout(callback, 0);
  }
}
function isPromise(obj) {
  return !!(obj && typeof obj === "object" && typeof obj.then === "function");
}

class MyPromise {
  constructor(executor) {
    this._state = PENDING;
    this._value = undefined;
    this._handlers = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _runOneHandler({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (state !== this._state) return;
      if (typeof executor !== "function") {
        if (state === FULFILLED) {
          resolve(this._value);
        } else if (state === REJECTED) {
          reject(this._value);
        }
        return;
      }
      try {
        const result = executor(this._value);
        if (isPromise(result)) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  _runHandlers() {
    if (this._state === PENDING) return;
    while (this._handlers[0]) {
      this._runOneHandler(this._handlers[0]);
      this._handlers.shift();
    }
  }
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({ executor, state, resolve, reject });
  }
  then(onFulFilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulFilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers();
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  fianlly(onsettled) {
    return this.then(
      (data) => {
        onsettled();
        return data;
      },
      (reason) => {
        onsettled();
        throw reason;
      }
    );
  }

  static resolve(data) {
    if (data instanceof MyPromise) {
      return data;
    }
    return new MyPromise((resolve, reject) => {
      if (isPromise(data)) {
        data.then(resolve, reject);
      } else {
        resolve(data);
      }
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(proms) {
    return new MyPromise((resolve, reject) => {
      try {
        const results = [];
        let count = 0;
        let fulfilledCount = 0;
        for (const prom of proms) {
          let i = count;
          count++;
          MyPromise.resolve(prom).then((data) => {
            fulfilledCount++;
            results[i] = data;
            if (fulfilledCount === count) {
              resolve(results);
            }
          }, reject);
        }
        if (count === 0) {
          resolve(results);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  static allSettled(proms) {
    const ps = [];
    for (const prom in proms) {
      ps.push(
        MyPromise.resolve(prom).then(
          (data) => ({ state: FULFILLED, value: data }),
          (reason) => ({ state: REJECTED, reason: reason })
        )
      );
    }
    return MyPromise.all(ps);
  }

  static race(proms) {
    return new MyPromise((resolve, reject) => {
      for (const prom of proms) {
        MyPromise.resolve(prom).then(resolve, reject);
      }
    });
  }

  _changeState(state, value) {
    if (this._state !== PENDING) return;
    this._state = state;
    this._value = value;
    this._runHandlers();
  }

  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  _reject(reason) {
    this._changeState(REJECTED, reason);
  }
}
