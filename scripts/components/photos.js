

class Photos extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      photos: props.photos.length >= props.min ? props.photos : [...props.photos, ...Array(props.min - props.photos.length).fill().map((_, i) => "/faces/empty.png")]
    }
  }


  render() {
    return <div className="grid grid--guttered full_images">
      {this.state.photos.map((photo, index)=> (
      <div key={index} className="col col--4of12">
        <img className="rounded shadowed" src={`https://montrealuploads.imgix.net${photo}?auto=format,compress`} />
      </div>
      ))}
    </div>
  }
}