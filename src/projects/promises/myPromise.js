/* eslint-disable no-underscore-dangle */

// ECMAScript Promise spec
// https://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor

// Taken from:
// http://thecodebarbarian.com/write-your-own-node-js-promise-library-from-scratch.html

export default class MyPromise {
  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(err) {
    return new MyPromise((resolve, reject) => {
      reject(err);
    });
  }

  // `executor` takes 2 parameters, `resolve()` and `reject()`. The executor
  // function is responsible for calling `resolve()` or `reject()` to say that
  // the async operation succeeded (resolved) or failed (rejected).
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error('Executor must be a function');
    }

    // Internal state. `$state` is the state of the promise, and `$chained` is
    // an array of the functions we need to call once this promise is settled.
    this.$state = 'PENDING';
    this.$chained = [];

    const reject = (err) => {
      if (this.$state !== 'PENDING') {
        return;
      }
      this.$state = 'REJECTED';
      this.$internalValue = err;

      this.$chained.forEach(({ onRejected }) => {
        process.nextTick(onRejected, err);
      });
    };

    // Implement `resolve()` and `reject()` for the executor function to use
    const resolve = (res) => {
      // A promise is considered "settled" when it is no longer
      // pending, that is, when either `resolve()` or `reject()`
      // was called once. Calling `resolve()` or `reject()` twice
      // or calling `reject()` after `resolve()` was already called
      // are no-ops.
      if (this.$state !== 'PENDING') {
        return null;
      }

      if (this === res) {
        throw new TypeError('The promise and its value refer to the same object');
      }

      try {
        const then = res && res.then;
        if (typeof then === 'function') {
          // In this case, the promise is "resolved", but still in the 'PENDING'
          // state. This is what the ES6 spec means when it says "A resolved promise
          // may be pending, fulfilled or rejected" in
          // http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
          return then.call(res, resolve, reject);
        }
      } catch (e) {
        throw new Error('res.then threw');
      }

      this.$state = 'FULFILLED';
      this.$internalValue = res;

      this.$chained.forEach(({ onFulfilled }) => {
        process.nextTick(onFulfilled, res);
      });

      return res;
    };

    // Call the executor function with `resolve()` and `reject()` as in the spec.
    try {
      // If the executor function throws a sync exception, we consider that
      // a rejection. Keep in mind that, since `resolve()` or `reject()` can
      // only be called once, a function that synchronously calls `resolve()`
      // and then throws will lead to a fulfilled promise and a swallowed error
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // `onFulfilled` is called if the promise is fulfilled, and `onRejected`
  // if the promise is rejected. For now, you can think of 'fulfilled' and
  // 'resolved' as the same thing.
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      // Ensure that errors in `onFulfilled()` and `onRejected()` reject the
      // returned promise, otherwise they'll crash the process. Also, ensure
      // that the promise
      const _onFulfilled = (res) => {
        try {
          // If `onFulfilled()` returns a promise, trust `resolve()` to handle
          // it correctly.
          let value = res;

          if (typeof onFulfilled === 'function') {
            value = onFulfilled(res);
          }

          resolve(value);
        } catch (err) {
          reject(err);
        }
      };

      const _onRejected = (err) => {
        try {
          if (typeof onRejected === 'function') {
            resolve(onRejected(err));
          } else {
            reject(err);
          }
        } catch (e) {
          reject(e);
        }
      };

      if (this.$state === 'FULFILLED') {
        process.nextTick(_onFulfilled, this.$internalValue);
      } else if (this.$state === 'REJECTED') {
        process.nextTick(_onRejected, this.$internalValue);
      } else {
        this.$chained.push({ onFulfilled: _onFulfilled, onRejected: _onRejected });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
