
class Account extends Overlay {

  noescape = true
  togglers = "data-toggle-account"

  constructor(props) {
    super(props)

    this.state = {
      session: new Session(),
      showed: false
    }

    if (props.session) {
      this.state.session.id = props.session._id
      this.state.session.attributes = props.session

      this.fetchUser()
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()
    key("escape", this.toggle)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    key.unbind("escape", this.toggle)
  }

  fetchUser() {
    const user = new Face()
    user.id = this.state.session.attributes.user_id
    user.fetch().then((user)=> { 
      this.setState({ user: user })
    })

    window.user = user
  }


  login(e, state) {
    this.state.session.save(state).then((session)=> {
      this.setState({ session: session })
      this.fetchUser()
      Turbolinks.visit(window.location.pathname)
    })
  }

  logout(e) {
    this.state.session.destroy().then((session)=> {
      this.setState({ session: new Session(), user: null })
      Turbolinks.visit(window.location.pathname)
    })
  }


  render() {
    

    return <div className={`overlay${this.state.showed ? " overlay--show" : ""}`}>
      <Button className="button--transparent overlay__back" onClick={this.hide} />
      <div className="padded padded--tight overlay__container">
        {this.state.session.id &&
        <div className="text_center">
          {this.state.user && <div className="normal_bottom">
            <h2>Hi {this.state.user.attributes.first_name}!</h2>
            <a className="button" onClick={this.hide} href={`/faces/${this.state.user.attributes.handle}`}>Head to your profile</a>
          </div>}
          <Button className="button--transparent" label="Logout" onClick={this.logout} />
        </div>
        ||
        <Form className="col col--14of20 col--tablet_portrait--16of20 col--phone--18of20"
          onSubmit={this.login}
          cta="Log in"
          fields={[
            {
              type: "email",
              name: "email",
              label: "Email address",
              placeholder: "your.email.address@gmail.com"
            },
            {
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "********"
            }
          ]}>
        </Form>
        }
      </div>
    </div>
  }

}