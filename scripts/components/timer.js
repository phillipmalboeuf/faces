

class Timer extends React.Component {

  constructor(props) {
    super(props)

    this.now = new Date()
    this.then = this.props.until

    this.state = {
      until: this.then - this.now
    }
  }

  componentDidMount() {
    setInterval(()=>{
      this.now = new Date()

      this.setState({
        until: this.then - this.now
      })

    }, 1000)
  }

  render() {
    let delta = this.state.until / 1000
    let days = Math.floor(delta / 86400)
    delta -= days * 86400

    let hours = Math.floor(delta / 3600) % 24
    delta -= hours * 3600

    let minutes = Math.floor(delta / 60) % 60
    delta -= minutes * 60

    let seconds = Math.floor(delta % 60)

    return <React.Fragment>
      {days} days {hours} hours {minutes} minutes {seconds} seconds
    </React.Fragment>
  }
}

