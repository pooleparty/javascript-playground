import MyPromise from '../myPromise';

const assert = require('assert');

const dummy = { dummy: 'dummy' };

function resolved(value) {
  return MyPromise.resolve(value);
}

function rejected(err) {
  return MyPromise.reject(err);
}

function deferred() {
  const o = {};
  o.promise = new MyPromise((resolve, reject) => {
    o.resolve = resolve;
    o.reject = reject;
  });
  return o;
}

function callbackAggregator(times, ultimateCallback) {
  let soFar = 0;
  return function () {
    if (++soFar === times) {
      ultimateCallback();
    }
  };
}

const sentinel = { sentinel: 'sentinel' }; // a sentinel fulfillment value to test for with strict equality
const sentinel2 = { sentinel2: 'sentinel2' };
const sentinel3 = { sentinel3: 'sentinel3' };

const promise = rejected(sentinel);
const done = () => console.log('done');

const semiDone = callbackAggregator(3, done);

promise.then(null, () => sentinel).then((value) => {
  assert.strictEqual(value, sentinel);
  semiDone();
});

promise
  .then(null, () => {
    throw sentinel2;
  })
  .then(null, (reason) => {
    assert.strictEqual(reason, sentinel2);
    semiDone();
  });

promise.then(null, () => sentinel3).then((value) => {
  assert.strictEqual(value, sentinel3);
  semiDone();
});
