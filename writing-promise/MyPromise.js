// 记录Prommise的三种状态。提出来是因为如果后续修改中间状态的名称可以不修改核心代码
// 官方曾修改过一次状态名称 resolved --> fulfilled
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * @description: 把传递的函数伪造成一个任务返回到微队列中
 * @param {function} callback 传递要放到微队列中回调的函数
 */
function runMicroTask(callback) {
  // 为了避免 直接使用未定义的变量，前面加上 globalThis
  // globalThis 指的是 全局对象，浏览器环境为window，node环境为global

  // 判断是否为 node 环境
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
    // 如果不是node环境，也没有 MutationObserver 方法，就用定时器模拟一下
    setTimeout(callback, 0);
  }
}

/**
 * @description: 判断一个变量是否是Promise对象
 * @param {*} obj 待判断的变量
 * @return {*} true / false
 */
function isPromise(obj) {
  return !!(obj && typeof obj === "object" && typeof obj.then === "function");
}

class MyPromise {
  /**
   * @description: 构造器
   * @param {*} executor 任务执行器，立即执行该任务
   */
  constructor(executor) {
    this._state = PENDING;
    this._value = undefined;
    // 处理队列
    this._handlers = [];
    try {
      // 绑定后续的this指向
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  /**
   * @description: 执行单个handler
   * @param {function} executor 执行器
   * @param {string} state 这个fun 执行的状态
   * @param {function} resolve 让then函数返回Promise成功
   * @param {function} reject 让then函数返回的Promise失败
   */
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

  /**
   * @description: 将handler队列逐一推进执行队列
   * @param {*} if
   * @return {*}
   */
  _runHandlers() {
    if (this._state === PENDING) return;
    while (this._handlers[0]) {
      this._runOneHandler(this._handlers[0]);
      this._handlers.shift();
    }
  }

  /**
   * @description: 向处理队列中添加一个任务
   * @param {function} executor 执行器
   * @param {string} state 这个fun 执行的状态
   * @param {function} resolve 让then函数返回Promise成功
   * @param {function} reject 让then函数返回的Promise失败
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({ executor, state, resolve, reject });
  }

  /**
   * @description: 更改任务状态
   * @param {string} state 新状态
   * @param {*} value 相关数据
   */
  _changeState(state, value) {
    if (this._state !== PENDING) return;
    this._state = state;
    this._value = value;
    this._runHandlers();
  }

  /**
   * @description: 标记当前任务完成
   * @param {*} data 任务完成的相关数据
   */
  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  /**
   * @description: 标记当前任务失败
   * @param {*} reason 任务失败的相关数据
   * @return {*}
   */
  _reject(reason) {
    this._changeState(REJECTED, reason);
  }

  /**
   * @description: Promise A+规范的then方法
   * @param {function} onFulFilled 成功后的回调
   * @param {function} onRejected 失败后的回调
   */
  then(onFulFilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulFilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers(); // 执行队列
    });
  }

  /**
   * @description: 仅处理失败的场景
   * @param {*} onRejected 失败后的回调
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * @description: 无论成功还是失败都会执行回调
   * @param {*} onsettled 已决后的回调
   * @return {*}
   */
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

  /**
   * @description: 返回一个已完成的Promise
   */
  static resolve(data) {
    // 传递的data本身就是ES6的Promise对象
    if (data instanceof MyPromise) {
      return data;
    }
    return new MyPromise((resolve, reject) => {
      // 传递的data是PromiseLike（Promise A+），返回新的Promise，状态和其保持一致即可
      if (isPromise(data)) {
        data.then(resolve, reject);
      } else {
        resolve(data);
      }
    });
  }

  /**
   * @description: 得到一个被拒绝的Promise
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  /**
   * @description: 得到一个新的Promise
   */
  static all(proms) {
    return new MyPromise((resolve, reject) => {
      try {
        const results = [];
        let count = 0;
        let fulfilledCount = 0;
        // proms是一个迭代器，包含多个Promise 需要用 for of 遍历
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

  /**
   * @description: 等待所有的Promise有结果之后 该方法返回的Promise完成 并且按照顺序将所有结果汇总
   */
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

  /**
   * @description: 返回的Promise与第一个有结果的一致
   * @param {*} proms
   * @param {*} reject
   * @return {*}
   */
  static race(proms) {
    return new MyPromise((resolve, reject) => {
      for (const prom of proms) {
        MyPromise.resolve(prom).then(resolve, reject);
      }
    });
  }
}
