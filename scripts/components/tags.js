

class Tags extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected
    }
  }


  render() {
    console.log(this.props.tags)
    return [
      <div className="normal_bottom" key="gender">
        <label>Gender</label>
        <div className="tags">
          {this.props.tags.filter((tag)=> tag.type === "gender").map((tag, index)=> 
          <span className="tag"><Input type="checkbox" name={`${this.props.name}:${tag.key}`} label={tag.title} /></span>
          )}
        </div>

        <label>Ethnicity</label>
        <div className="tags">
          {this.props.tags.filter((tag)=> tag.type === "ethnicity").map((tag, index)=> 
          <span className="tag"><Input type="checkbox" name={`${this.props.name}:${tag.key}`} label={tag.title} /></span>
          )}
        </div>

        <label>Hair type</label>
        <div className="tags">
          {this.props.tags.filter((tag)=> tag.type === "hair").map((tag, index)=> 
          <span className="tag"><Input type="checkbox" name={`${this.props.name}:${tag.key}`} label={tag.title} /></span>
          )}
        </div>

        <label>Body type</label>
        <div className="tags">
          {this.props.tags.filter((tag)=> tag.type === "body").map((tag, index)=> 
          <span className="tag"><Input type="checkbox" name={`${this.props.name}:${tag.key}`} label={tag.title} /></span>
          )}
        </div>

        <label>Style</label>
        <div className="tags">
          {this.props.tags.filter((tag)=> tag.type === "style").map((tag, index)=> 
          <span className="tag"><Input type="checkbox" name={`${this.props.name}:${tag.key}`} label={tag.title} /></span>
          )}
        </div>
      </div>
    ]
  }
}