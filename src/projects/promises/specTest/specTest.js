import promisesAplusTests from 'promises-aplus-tests';
import MyPromise from '../myPromise';

const adapter = {
  resolved(value) {
    return MyPromise.resolve(value);
  },
  rejected(err) {
    return MyPromise.reject(err);
  },
  deferred() {
    const o = {};
    o.promise = new MyPromise((resolve, reject) => {
      o.resolve = resolve;
      o.reject = reject;
    });
    return o;
  },
};

promisesAplusTests(adapter, {
  reporter: 'mochawesome',
  grep: '`y` is a thenable',
});
