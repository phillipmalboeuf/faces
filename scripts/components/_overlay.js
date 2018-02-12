


class Overlay extends React.Component {

  noscroll = true

  constructor(props) {
    super(props)
    this.state = {
      showed: false
    }

    this.toggle = this.toggle.bind(this)
    this.hide = this.hide.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
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
}
