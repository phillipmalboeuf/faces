


window.Core = {
  init() {
    console.log('c:c:')
    this.render()
  },

  render() {
    let element = null
    for (let i = window.components.length - 1; i >= 0; i--) {
      element = document.querySelectorAll(window.components[i].element)[0]
      element.setAttribute("data-component", window.components[i].component)
      
      ReactDOM.render(React.createElement(window[window.components[i].component], window.components[i].data), element)
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
  if (window.ga) {
    window.ga('send', 'pageview', location.pathname + location.search)
  }
  
  window.Core.render()
})
document.addEventListener("turbolinks:before-render", ()=> {
  window.Core.destroy()
})
    
  



