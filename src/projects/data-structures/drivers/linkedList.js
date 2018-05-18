import LinkedList, { EVENTS } from '../linked-list';

const list = new LinkedList();

list.on(EVENTS.EVENT_EMITTED, (e) => {
  console.log(e);
});

console.log('Initial List');
list.prettyPrint();

list.append(1);
list.append(2);
list.append(3);
list.append(4);
list.append(5);

console.log('Add items');
list.prettyPrint();

console.log('Remove "3"');
list.remove(3);
list.prettyPrint();

console.log('Append "0" at index 0');
list.appendAt(0, 0);
list.prettyPrint();

console.log('Remove item at index 2');
list.removeAt(2);
list.prettyPrint();

console.log('List has a length of', list.length(), '\n');

console.log('List is empty?', list.isEmpty(), '\n');

console.log('Traverse list and print type of each item and index');
list.traverse(({ data }, idx) => console.log(typeof data, idx));
console.log();

console.log('Reverse');
list.reverse();
list.prettyPrint();

console.log('Swap indices 1 and 3');
list.swap(1, 3);
list.prettyPrint();

console.log('Search for value "1"');
const i = list.search(1);
console.log(`Found "1" at position ${i}`, '\n');

console.log('Add duplicates');
list.append(2);
list.append(5);
list.append(0);
list.append(1);
list.prettyPrint();

console.log('Remove duplicates');
list.removeDuplicates();
list.prettyPrint();
