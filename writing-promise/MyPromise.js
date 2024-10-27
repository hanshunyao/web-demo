const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function runMicroTask(callback) {
  if (process && process.nextTick) {
    process.nextTick(callback);
  } else if (MutationObserver) {
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
function isPromise(obj){
  return !!(obj && typeof obj === 'object' && typeof obj.then === 'function')
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

  _runOneHandlers({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (state === this._changeState) return;
      if (typeof executor !== "function") {
        if (state === FULFILLED) {
          resolve(this._value);
        } else if (state === REJECTED) {
          reject(this._value);
        }
        return;
      }
      try{
        const result = executor(this._value)
        if(isPromise(result)){
          result.then(resolve, reject)
        }else{
          resolve(result)
        }
      }catch(err){
        reject(err)
      }
    });
  }
  _runHandlers() {
    if (this._state === PENDING) return;
    while (this._handlers[0]) {
      this._runOneHandlers(this._handlers[0]);
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

const pro = new MyPromise((resolve, reject) => {
  resolve(123321);
});
// pro.then(function A(){})
pro.then(
  function A() {},
  function B() {}
);
console.log(pro);
