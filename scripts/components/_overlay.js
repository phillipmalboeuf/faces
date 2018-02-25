


class Overlay extends React.Component {

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
    
    this.setState({showed: !this.state.showed})
  }

  hide(e) {
    if (this.state.showed) {
      this.setState({showed: false})
    }
  }

  click(e) {
    if (this.togglers && e.target.hasAttribute(this.togglers)) {
      e.preventDefault()
      this.toggle()
    }
  }

  render() {
    return <div className={`overlay${this.state.showed ? " overlay--show": ""}`}>
      <a className="overlay__back" onClick={this.hide.bind(this)} />
      <div className="overlay__container">
        {this.props.children}
      </div>
    </div>
  }
}
