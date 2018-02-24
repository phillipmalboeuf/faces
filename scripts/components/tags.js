

class Tags extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected ? props.selected.reduce((tags, tag) => { tags[tag] = true; return tags; }, {}) : {}
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.state.selected[e.currentTarget.name.split(":")[1]] = e.currentTarget.checked

    this.props.onChange({currentTarget: {
      name: this.props.name,
      type: "tags",
      value: Object.keys(this.state.selected).filter((key) => this.state.selected[key]).map((key) => key)
    }})

    this.setState({
      selected: this.state.selected
    })
  }


  render() {

    const renderTags = (type) => {
      return <div className="tags">
        {this.props.tags.filter((tag)=> tag.type === type).map((tag, index)=> 
        <span key={index} className="tag">
          <Input onChange={this.onChange} type="checkbox"
            name={`${this.props.name}:${tag.key}`}
            label={tag.title}
            checked={this.state.selected[tag.key] ? true : false} />
        </span>
        )}
      </div>
    }

    return <div className="normal_bottom">
      <label>Gender (Optional)</label>
      {renderTags("gender")}

      <label>Ethnicity (Optional)</label>
      {renderTags("ethnicity")}

      <label>Hair type (Optional)</label>
      {renderTags("hair")}

      <label>Body type (Optional)</label>
      {renderTags("body")}

      <label>Style (Optional)</label>
      {renderTags("style")}
    </div>
  }
}