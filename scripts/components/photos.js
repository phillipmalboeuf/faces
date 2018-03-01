

class Photos extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      photos: props.photos
    }

    this.file = document.createElement("input")
    this.file.type = "file"

    this.click = this.click.bind(this)
    this.upload = this.upload.bind(this)
    this.remove = this.remove.bind(this)
  }

  componentDidMount() {
    this.file.addEventListener("change", this.upload)
  }

  componentWillUnmount() {
    this.file.removeEventListener("change", this.upload)
  }

  remove(e, index) {
    e.stopPropagation()
    this.setPhotos(this.state.photos.filter((photo, i)=> i != index))
  }

  click(e, index) {
    this.file.click()
  }

  upload(e) {
    let file = e.currentTarget.files[0]
    if (file && file.type.match('image.*')) {
      Turbolinks.controller.adapter.progressBar.setValue(0)
      Turbolinks.controller.adapter.progressBar.show()

      Upload.upload(file).then((response)=> {
        Turbolinks.controller.adapter.progressBar.setValue(100)
        Turbolinks.controller.adapter.progressBar.hide()
        
        this.setPhotos([...this.state.photos, response.url])
      })
    }
  }

  setPhotos(photos) {
    this.props.onChange({currentTarget: {
      name: this.props.name,
      type: "photos",
      value: photos
    }})

    this.setState({
      photos: photos
    })
  }

  render() {
    return [
      this.props.label && <label key="label" htmlFor={this.props.name}>{this.props.label}{this.props.optional ? " (Optional)" : "" }</label>,
      <div key="photos" ref={(element) => this.container = element} className="grid grid--tight_guttered grid--stretch medium_bottom full_images">
        {this.state.photos.map((photo, index)=> (
        <div key={index} className="col col--4of12 absolute_container">
          <div className="absolute absolute--top_right"><Button className="button--small button--grey button--faded" onClick={(e)=> this.remove(e, index)} label="Remove" /></div>
          <img className="rounded shadowed" src={`https://montrealuploads.imgix.net${photo}?auto=format,compress&w=200`} data-photo={photo} />
        </div>
        ))}

        <div className="col col--4of12 grid grid--stretch" data-no-drag>
          <Button className="button--dashed" onClick={(e)=> this.click(e)} label="Upload Photo" />
        </div>
      </div>
    ]
  }
}