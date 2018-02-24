

class Photos extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      photos: props.photos.length >= props.min ? props.photos : [...props.photos, ...Array(props.min - props.photos.length).fill().map((_, i) => "/faces/empty.png")]
    }

    this.file = document.createElement("input")
    this.file.type = "file"

    this.click = this.click.bind(this)
    this.upload = this.upload.bind(this)
    this.finishLoad = this.finishLoad.bind(this)
  }

  componentDidMount() {
    this.file.addEventListener("change", this.upload)
  }

  componentWillUnmount() {
    this.file.removeEventListener("change", this.upload)
  }

  click(e, index) {
    this.file.target = e.currentTarget
    this.file.index = index
    this.file.click()
  }

  upload(e) {
    let file = e.currentTarget.files[0]
    if (file && file.type.match('image.*')) {
      Turbolinks.controller.adapter.progressBar.setValue(0)
      Turbolinks.controller.adapter.progressBar.show()

      Upload.upload(file).then((response)=> {
        this.file.target.setAttribute("src", `https://montrealuploads.imgix.net${response.url}`)
        this.state.photos[this.file.index] = response.url

        this.props.onChange({currentTarget: {
          name: this.props.name,
          type: "photos",
          value: this.state.photos
        }})

        this.setState({
          photos: this.state.photos
        })
      })
    }
  }

  finishLoad(e) {
    Turbolinks.controller.adapter.progressBar.setValue(100)
    Turbolinks.controller.adapter.progressBar.hide()
  }

  render() {
    return [
      this.props.label && <label key="label" htmlFor={this.props.name}>{this.props.label}{this.props.optional ? " (Optional)" : "" }</label>,
      <div key="photos" className="grid grid--guttered medium_bottom full_images">
        {this.state.photos.map((photo, index)=> (
        <div key={index} className="col col--3of12">
          <img onClick={(e)=> this.click(e, index)} onLoad={this.finishLoad} className="img--clickable rounded shadowed" src={`https://montrealuploads.imgix.net${photo}?auto=format,compress`} />
        </div>
        ))}
      </div>
    ]
  }
}