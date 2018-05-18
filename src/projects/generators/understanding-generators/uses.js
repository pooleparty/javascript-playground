/**
 * IMPLEMENTING ITERABLES
 *
 * When you implement an iterator, you have to manually make an iterator
 * object with a next() method. Also, you have to manually save the state.
 *
 * Often times, it becomes really hard to do that.
 *
 * Since generators are also iterables, they can be used to implement
 * iterables without the extra boilerplate code.
 */

/**
 * Problem: We want to make a custom iterable that returns This, is, and iterable..
 */
// USING ITERABLES
{
  const iterableObj = {
    [Symbol.iterator]() {
      let step = 0;
      return {
        next() {
          step++;
          if (step === 1) {
            return { value: 'This', done: false };
          } else if (step === 2) {
            return { value: 'is', done: false };
          } else if (step === 3) {
            return { value: 'iterable (with iterator)', done: false };
          }
          return { value: '', done: true };
        },
      };
    },
  };

  for (const val of iterableObj) {
    console.log(val);
  }
}

// USING GENERATORS
{
  function* iterableObj() {
    yield 'This';
    yield 'is';
    yield 'iterable (with generators)';
  }

  for (const val of iterableObj()) {
    console.log(val);
  }
}

/**
 * A few things to note about the generator implementation
 *
 * We don’t have to worry about Symbol.iterator
 *
 * We don have to implement next().
 *
 * We don’t have to manually make the return object of next()
 * i.e { value: 'This', done: false }.
 *
 * We don’t have to save the state.
 * In the iterator’s example, the state was saved in the variable step.
 * It’s value defined what was output from the iterable.
 */

/**
 * Infinite Data Stream
 */
{
  function* naturalNumbers() {
    let num = 1;
    while (true) {
      yield num;
      num++;
    }
  }

  const numbers = naturalNumbers();

  console.log(numbers.next().value);
  console.log(numbers.next().value);
  console.log(numbers.next().value);
}

/**
 * GENERATORS AS OBSERVERS
 *
 * http://exploringjs.com/es6/ch_generators.html#sec_generators-as-observers
 *
 * Generators can also receive values using the next(val) function.
 *
 * Then the generator is called an observer since it wakes up when
 * it receives new values.
 *
 * In a sense, it keeps observing for values and acts when it gets one.
 */

function* dataConsumer() {
  console.log('Started');
  console.log(`${yield}`);
  console.log(`${yield}`);
  return 'result';
}

const genObj = dataConsumer();
genObj.next();
genObj.next('a');
genObj.next('b');
genObj.next();

/**
 * When using a generator as an observer, it is important to note that the only
 * purpose of the first invocation of next() is to start the observer.
 *
 * It is only ready for input afterwards, because this first invocation advances
 * execution to the first yield.
 *
 * Therefore, any input you send via the first next() is ignored:
 */
function* gen() {
  while (true) {
    const input = yield;
    console.log(input);
  }
}

const obj = gen();
obj.next('a');
obj.next('b');

/**
 * Utility function that takes a generator and returns a function
 * that when called, will start the generator and return it.
 *
 * @param {Function} generatorFunction
 */
function coroutine(generatorFunction) {
  return (...args) => {
    const generatorObject = generatorFunction(...args);
    generatorObject.next(); // Start the generator
    return generatorObject;
  };
}

const wrapped = coroutine(function* w() {
  console.log(`First input ${yield}`);
  return 'DONE';
});

wrapped().next('hello!');
