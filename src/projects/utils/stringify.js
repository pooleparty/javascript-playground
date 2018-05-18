export default function (obj) {
  const placeholder = '____PLACEHOLDER____';
  const fns = [];
  let json = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'function') {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2,
  );
  json = json.replace(new RegExp(`"${placeholder}"`, 'g'), () => fns.shift());
  return json;
}
