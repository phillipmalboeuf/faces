
class Gallery extends Overlay {

  togglers = "data-toggle-gallery"

  constructor(props) {
    super(props)
    this.state = {
      showed: false,
      loaded: false
    }
    this.left = this.left.bind(this)
    this.right = this.right.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()
    this.flkty = new Flickity(this.slider, {
      wrapAround: true,
      pageDots: false,
      adaptiveHeight: false,
      accessibility: false,
      selectedAttraction: 0.01,
      friction: 0.15
    })
    key("left", this.left)
    key("right", this.right)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.flkty.destroy()
    key.unbind("left", this.left)
    key.unbind("right", this.right)
  }

  toggle(e) {
    this.flkty.select(e.target.getAttribute(this.togglers), false, true)
    this.setState({
      loaded: true
    })
    super.toggle(e)
  }

  left(e) {
    this.flkty.previous()
  }

  right(e) {
    this.flkty.next()
  }


  render() {
    return <div className={`overlay${this.state.showed ? " overlay--show" : ""}`}>
      <Button className="button--transparent overlay__back" />
      <div ref={(element)=> this.slider = element} className="slider">
        {this.props.photos.map((photo, index)=> <div key={index} className="slide">
          <img src={this.state.loaded && photo} />
        </div>)}
      </div>
      <Button className="button--transparent overlay__close" label="Close" onClick={this.hide} />
    </div>
  }

}