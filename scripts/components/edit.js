
class Edit extends Overlay {

  togglers = "data-toggle-edit"

  constructor(props) {
    super(props)
    this.state = {
      showed: false
    }
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }


  render() {
    return <div className={`overlay${this.state.showed ? " overlay--show" : ""}`}>
      <Button className="button--transparent overlay__back" onClick={this.hide} />
      <div className="padded padded--tight overlay__container">
        <Form
          model={this.props.model}
          modelId={this.props.modelId}
          values={this.props.values}
          fields={this.props.fields}
          cta="Edit" />
      </div>
    </div>
  }

}