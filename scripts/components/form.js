

class Form extends React.Component {

  onSubmit(e) {
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
      <form className={this.props.className} action={this.props.action} method={this.props.method} 
        onSubmit={this.onSubmit.bind(this)}>
        {React.Children.map(this.props.children, (child) => React.cloneElement(child, {onChange: this.onChange.bind(this)}))}
      </form>
    )
  }
}