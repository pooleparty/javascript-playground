/**
 * LAZY EVALUATION
 *
 * Lazy Evaluation is an evaluation model which delays the evaluation
 * of an expression until its value is needed.
 *
 * That is, if we don’t need the value, it won’t exist.
 *
 * It is calculated as we demand it.
 */
function* powerSeries(number, power) {
  let base = number;
  while (true) {
    yield base ** power;
    base++;
  }
}

const powersOf2 = powerSeries(3, 2);

console.log(powersOf2.next().value);
console.log(powersOf2.next().value);
console.log(powersOf2.next().value);

/**
 * MEMORY EFFICIENT
 *
 * A direct consequence of Lazy Evaluation is that generators are memory efficient.
 *
 * We generate only the values that are needed.
 *
 * With normal functions, we needed to pre-generate all the values
 * and keep them around in case we use them later.
 *
 * However, with generators, we can defer the computation till we need it.
 *
 *
 * We can create combinator functions to act on generators.
 *
 * Combinators are functions that combine existing iterables to create new ones.
 *
 * One such combinator is take.
 *
 * It takes first n elements of an iterable.
 */
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

take(3, ['a', 'b', 'c', 'd', 'e']);
// a b c

take(5, powerSeries(3, 2));
// 9 16 25 36 49

function* naturalNumbers() {
  let num = 1;
  while (true) {
    yield num;
    num++;
  }
}

function* cycled(iter) {
  const arrOfValues = [...iter];
  while (true) {
    for (const val of arrOfValues) {
      yield val;
    }
  }
}
console.log(...take(10, cycled(take(3, naturalNumbers()))));
