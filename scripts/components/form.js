

class Form extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      waiting: false,
      success: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(e) {
    this.setState({
      waiting: true
    })

    if (this.props.onSubmit) {
      e.preventDefault()
      this.props.onSubmit(e, this.state)
    }
  }

  onChange(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }


  render() {
    return (
      <form className={this.props.className} action={this.props.action} method={this.props.method || "POST"} 
        onSubmit={this.onSubmit}>
        {this.props.children
        ? this.props.children
        : this.props.fields.map((field, index)=> {
          if (field.type == "header") {
            return <h3 className="padded padded--tight flat_bottom text_center" key={index}>{field.body}</h3>
          } else if (field.type == "info") {
            return <p className="padded padded--tight flat_bottom text_center" key={index}>{field.body}</p>
          } else if (field.type == "link") {
            return <p className="padded padded--tight flat_bottom text_center" key={index}><a href={field.url} target={field.target} className="underline highlight">{field.body ? field.body : field.url}</a></p>
          } else if (field.type == "photos") {
            return <Photos key={index} name={field.name}
              editable
              onChange={this.onChange}
              min={field.min || 6}
              photos={this.props.values && this.props.values[field.name] || field.value || []} />
          } else if (field.type == "tags") {
            return <Tags key={index} name={field.name}
              editable
              onChange={this.onChange}
              tags={field.tags || []}
              selected={this.props.values && this.props.values[field.name] || field.value || []} />
          } else {
            return <Input key={index} name={field.name}
              onChange={this.onChange}
              type={field.type}
              value={this.props.values && this.props.values[field.name] || field.value}
              label={field.label}
              options={field.options}
              multiple={field.multiple}
              optional={field.optional}
              placeholder={field.placeholder}
              autoFocus={field.autofocus}
              new={field.new} />
          }
        })}

        <Button key="button" label={this.state.waiting ? this.state.success ? "Success!" : "One moment..." : this.props.cta} disabled={this.state.waiting} />
      </form>
    )
  }
}