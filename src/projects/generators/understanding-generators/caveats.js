/**
 * GENERATORS ARE ONE-TIME ACCESS ONLY
 *
 * Once you’ve exhausted all the values, you can’t iterate over it again.
 *
 * To generate the values again, you need to make a new generator object.
 */

function* naturalNumbers() {
  let num = 1;
  while (true) {
    yield num;
    num++;
  }
}

function* take(n, iter) {
  let index = 0;
  for (const val of iter) {
    if (index >= n) {
      return;
    }
    index++;
    yield val;
  }
}

const numbers = naturalNumbers();
console.log('First call: ', ...take(10, numbers)); // 1 2 3 4 5 6 7 8 9 10
console.log('Second call: ', ...take(10, numbers)); // This will not give any data

/**
 * GENERATORS DO NOT ALLOW RANDOM ACCESS AS POSSIBLE WITH ARRAYS
 *
 * Since the values are generated one by one, accessing a random value
 * would lead to computation of values till that element.
 *
 * Hence, it’s not random access.
 */
