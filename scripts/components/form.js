

class Form extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      waiting: false,
      success: false,
      errors: undefined
    }

    if (props.model) {
      this.state.model = new window[props.model]()
      if (props.modelId) {
        this.state.model.id = props.modelId
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.hideErrors = this.hideErrors.bind(this)
  }

  onSubmit(e) {
    this.setState({
      waiting: true
    })

    if (this.state.model) {
      e.preventDefault()
      this.state.model.save(this.state).then((model)=> {
        if (!model.errors) {
          this.setState({
            model: model,
            success: true
          })

          if (this.props.redirect) {
            Turbolinks.visit(this.props.redirect) 
          } else {
            if (model.attributes.route) {
              Turbolinks.visit(`${lang_route}${model.endpoint}/${model.attributes.route}`) 
            } else if (this.props.model != "session") {
              Turbolinks.visit(`${lang_route}${model.endpoint}/${model.attributes._id}`) 
            }
          }
            
        } else {
          this.setState({
            errors: model.errors,
            waiting: false
          })
        }
      }).catch((error)=> {
        this.setState({
          errors: "There's been a server error, please contact hi@goodfaces.club",
          waiting: false
        })
      })
    }

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

  hideErrors(e) {
    this.setState({
      errors: undefined
    })
  }


  render() {
    return [
      <form key="form" className={this.props.className} onSubmit={this.onSubmit} action={this.props.action} method={this.props.method || "POST"} 
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
      </form>,
      this.state.errors && <Overlay key="errors" show>
        <div className="text_center">
          <p className="small_bottom">{this.state.errors}</p>
          <Button tight onClick={this.hideErrors}>Okay, thanks</Button>
        </div>
      </Overlay>
    ]
  }
}