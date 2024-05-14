export function createElement(options) {
    const { tag = "div", text = "", children = [], classes = [] } = options;
    const element = document.createElement(tag);
    element.textContent = text;
    if (classes.length > 0) {
      element.classList.add(...classes);
    }
    element.append(...children);
    return element;
  }