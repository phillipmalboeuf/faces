


class Overlay extends React.Component {

  noscroll = true
  noescape = false
  togglers = undefined

  constructor(props) {
    super(props)
    this.state = {
      showed: false
    }

    this.toggle = this.toggle.bind(this)
    this.hide = this.hide.bind(this)
    this.click = this.click.bind(this)
  }

  componentDidMount() {
    document.addEventListener("click", this.click)
    if (!this.noescape) { key("escape", this.hide) }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.click)
    if (!this.noescape) { key.unbind("escape", this.hide) }
  }

  toggle(e) {
    if (e) {
      e.preventDefault()
      if (e.currentTarget && e.currentTarget.blur) {
        e.currentTarget.blur()
      }
    }
    
    if (this.noscroll) { document.documentElement.classList.toggle("noscroll") }
    this.setState({showed: !this.state.showed})
  }

  hide(e) {
    if (this.state.showed) {
      if (this.noscroll) { document.documentElement.classList.remove("noscroll") }
      this.setState({showed: false})
    }
  }

  click(e) {
    if (this.togglers && e.target.hasAttribute(this.togglers)) {
      e.preventDefault()
      this.toggle()
    }
  }
}
