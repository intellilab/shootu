export function createElement(tagName, props) {
  const el = document.createElement(tagName);
  if (props) {
    Object.keys(props).forEach(key => {
      el[key] = props[key];
    });
  }
  return el;
}
