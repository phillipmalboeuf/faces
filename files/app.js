"use strict";

var Component = function Component(props) {
  return React.createElement(
    "p",
    null,
    props.message
  );
};

window.Core = {
  init: function init() {
    this.render();
  },
  render: function render() {
    var data = {};
    var element = null;
    for (var i = window.components.length - 1; i >= 0; i--) {
      data = window.components[i]["data"];
      element = document.querySelectorAll(window.components[i]["element"])[0];
      element.setAttribute("data-component", window.components[i]["component"]);

      ReactDOM.render(window[window.components[i]["component"]](data), element);
    }
  },
  destroy: function destroy() {
    var elements = document.querySelectorAll("[data-component]");
    if (elements.length > 0) {
      for (var i = elements.length - 1; i >= 0; i--) {
        if (!elements[i].hasAttribute("data-turbolinks-permanent")) {
          ReactDOM.unmountComponentAtNode(elements[i]);
        }
      }
    }
  }
};

window.Core.init();
document.addEventListener("turbolinks:load", function () {
  window.Core.render();
});
document.addEventListener("turbolinks:before-render", function () {
  window.Core.destroy();
});
