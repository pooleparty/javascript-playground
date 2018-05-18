// yield*

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*
// The yield* expression is used delegate another generator or iterable object.
{
  function* func1() {
    yield 42;
  }

  function* func2() {
    yield* func1();
  }

  const iterator = func2();

  console.log(iterator.next().value);
} // expected output: 42

// function*

/*
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

  The function* declaration (function keyword followed by an asterisk)
  defines a generator function, which returns a Generator object.
*/
{
  function* generator(i) {
    yield i;
    yield i + 10;
  }

  const gen = generator(10);

  console.log(gen.next().value);
  // expected output: 10

  console.log(gen.next().value);
  // expected output: 20
}
