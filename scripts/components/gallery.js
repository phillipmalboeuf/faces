
class Gallery extends Overlay {

  togglers = "data-toggle-gallery"

  constructor(props) {
    super(props)
    this.state = {
      showed: false
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this.flkty = new Flickity(this.slider, {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      adaptiveHeight: false
    })
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.flkty.destroy()
  }

  toggle(e) {
    this.flkty.select(e.target.getAttribute(this.togglers), false, true)
    super.toggle(e)
  }


  render() {
    return <div className={`overlay${this.state.showed ? " overlay--show" : ""}`}>
      <Button className="button--transparent overlay__back" />
      <div ref={(element)=> this.slider = element} className="slider">
        {this.props.photos.map((photo, index)=> <div key={index} className="slide">
          <img src={photo} />
        </div>)}
      </div>
      <Button className="button--transparent overlay__close" label="Close" onClick={this.hide} />
    </div>
  }

}