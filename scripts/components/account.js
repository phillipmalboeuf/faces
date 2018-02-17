
class Account extends Overlay {

  constructor(props) {
    super(props)

    this.state = {
      session: new Session(),
      showed: false
    }

    this.file = document.createElement("input")
    this.file.type = "file"

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.save = this.save.bind(this)
    this.input = this.input.bind(this)
    this.click = this.click.bind(this)
    this.upload = this.upload.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()

    if (this.state.session.id) {
      this.fetchUser()
    }

    document.addEventListener("input", this.input)
    document.addEventListener("click", this.click)
    this.file.addEventListener("change", this.upload)

    key("command+s,ctrl+s", this.save)
    key("escape", this.toggle)
  }

  componentWillUnmount() {
    super.componentWillUnmount()

    document.removeEventListener("input", this.input)
    document.removeEventListener("click", this.click)
    this.file.removeEventListener("change", this.upload)

    key.unbind("command+s,ctrl+s", this.save)
    key.unbind("escape", this.toggle)
  }

  fetchUser() {
    const user = new User()
    user.fetch().then((user)=> { 
      this.setState({ user: user, showed: true })
    })

    window.user = user
  }

  login(e, state) {
    this.state.session.login(state).then((session)=> {
      this.setState({ session: session })
      Turbolinks.visit(window.location.pathname)
    })
  }

  logout(e) {
    this.state.session.logout().then((session)=> {
      this.setState({ session: new Session(), user: null })
      Turbolinks.visit(window.location.pathname)
    })
  }

  click(e) {
    if (e.target.hasAttribute("data-toggle-account")) {
      e.preventDefault()
      this.toggle()
    }
    // if (this.state.session.id && e.target.localName == "img") {
    //   this.file.key = e.target.getAttribute("data-key")
    //   // this.file.piece = e.target.getAttribute("data-piece")
    //   // this.file.author = e.target.getAttribute("data-author")
    //   // this.file.project = e.target.getAttribute("data-project")
    //   this.file.target = e.target
      
    //   if (this.file.piece || this.file.author || this.file.project) {
    //     this.file.dispatchEvent(new MouseEvent("click"))  
    //   }
    // }
  }

  input(e) {
    let key = e.target.getAttribute("data-key")
    // let piece = e.target.getAttribute("data-piece")
    // let author = e.target.getAttribute("data-author")
    // let project = e.target.getAttribute("data-project")
    
    // if (piece) {
    //   if (!this.state.pieces[piece]) { this.state.pieces[piece] = {} }
    //   this.state.pieces[piece][key] = e.target.innerHTML
    
    //   this.setState({
    //     pieces: this.state.pieces
    //   })
    // } else if (author) {
    //   if (!this.state.authors[author]) { this.state.authors[author] = {} }
    //   this.state.authors[author][key] = e.target.innerHTML
    
    //   this.setState({
    //     authors: this.state.authors
    //   })
    // } else if (project) {
    //   if (!this.state.projects[project]) { this.state.projects[project] = {} }
    //   this.state.projects[project][key] = e.target.innerHTML
    
    //   this.setState({
    //     projects: this.state.projects
    //   })
    // }
  }

  upload(e) {
    let file = e.currentTarget.files[0]
    if (file.type.match('image.*')) {
      if (Turbolinks) {
        Turbolinks.controller.adapter.progressBar.setValue(0)
        Turbolinks.controller.adapter.progressBar.show()
      }

      Upload.upload(file).then((response)=> {

        // if (this.file.piece) {
        //   if (!this.state.pieces[this.file.piece]) { this.state.pieces[this.file.piece] = {} }
        //   this.state.pieces[this.file.piece][this.file.key] = response.url
        
        //   this.setState({
        //     pieces: this.state.pieces
        //   })
        // } else if (this.file.author) {
        //   if (!this.state.authors[this.file.author]) { this.state.authors[this.file.author] = {} }
        //   this.state.authors[this.file.author][this.file.key] = response.url
        
        //   this.setState({
        //     authors: this.state.authors
        //   })
        // } else if (this.file.project) {
        //   if (!this.state.projects[this.file.project]) { this.state.projects[this.file.project] = {} }
        //   this.state.projects[this.file.project][this.file.key] = response.url
        
        //   this.setState({
        //     projects: this.state.projects
        //   })
        // }

        this.file.target.setAttribute("src", `https://montrealuploads.imgix.net${response.url}`)

        if (Turbolinks) {
          Turbolinks.controller.adapter.progressBar.setValue(100)
          Turbolinks.controller.adapter.progressBar.hide()
        }
      })
    }
  }

  save(e) {
    // if (Object.keys(this.state.pieces).length + Object.keys(this.state.authors).length + Object.keys(this.state.projects).length !== 0) {
    //   if (e) {
    //     e.preventDefault()
    //   }

    //   if (Turbolinks) {
    //     Turbolinks.controller.adapter.progressBar.setValue(0)
    //     Turbolinks.controller.adapter.progressBar.show()
    //   }

    //   let saves = []

      // for (let [_id, content] of Object.entries(this.state.pieces)) {
      //   for (let [key, value] of Object.entries(content)) {
      //     content[key] = value
      //   }

      //   let piece = new Piece()
      //   piece.id = _id
      //   saves.push(piece.save({ content: content }))
      // }

      // for (let [_id, attributes] of Object.entries(this.state.authors)) {
      //   let author = new Author()
      //   author.id = _id
      //   saves.push(author.save(attributes))
      // }

      // for (let [_id, attributes] of Object.entries(this.state.projects)) {
      //   let project = new Project()
      //   project.id = _id
      //   saves.push(project.save(attributes))
      // }

    //   Promise.all(saves).then((models)=> {
    //     if (Turbolinks) {
    //       Turbolinks.controller.adapter.progressBar.setValue(100)
    //       Turbolinks.controller.adapter.progressBar.hide()
    //     }

    //     // this.setState({
    //     //   pieces: {},
    //     //   authors: {},
    //     //   projects: {}
    //     // })
    //   })
    // }
  }

  render() {
    // console.log(this.state.pieces)
    return <div className={`overlay${this.state.showed ? " overlay--show" : ""}`}>
      <Button className="button--transparent overlay__back" onClick={this.hide} />
      <div className="padded padded--tight overlay__container">
        {this.state.session.id &&
        <div className="grid grid--middle grid--spaced_around">
          {/*<Button className="" label="Save Changes" onClick={this.save} disabled={Object.keys(this.state.pieces).length + Object.keys(this.state.authors).length + Object.keys(this.state.projects).length === 0} />*/}
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