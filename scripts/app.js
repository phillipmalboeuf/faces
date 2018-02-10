


window.Core = {
  init() {
    console.log("FACES")
    this.render()
  },

  render() {
    let data = {}
    let element = null
    for (let i = window.components.length - 1; i >= 0; i--) {
      data = window.components[i]["data"]
      element = document.querySelectorAll(window.components[i]["element"])[0]
      element.setAttribute("data-component", window.components[i]["component"])
      
      ReactDOM.render(React.createElement(window[window.components[i]["component"]], data), element)
    }
  },

  destroy() {
    const elements = document.querySelectorAll("[data-component]")
    if (elements.length > 0) {
      for (let i = elements.length - 1; i >= 0; i--) {
        if (!elements[i].hasAttribute("data-turbolinks-permanent")) {
          ReactDOM.unmountComponentAtNode(elements[i])  
        }
      }
    }
  }
}


window.Core.init()
document.addEventListener("turbolinks:load", ()=> {
  window.Core.render()
})
document.addEventListener("turbolinks:before-render", ()=> {
  window.Core.destroy()
})
    
  



