

class Session extends Model {

  endpoint = "sessions"

  constructor() {
    super()
  }


  save(data) {
    return super.save(data).then(()=> {
      Cookies.set("Session-Id", this.attributes._id)
      Cookies.set("Session-Secret", this.attributes.secret)
      Cookies.set("User-Id", this.attributes.user_id)

      return this
    })
  }

  destroy() {
    return super.destroy().then(()=> {
      Cookies.delete("Session-Id")
      Cookies.delete("Session-Secret")
      Cookies.delete("User-Id")
      Cookies.delete("Token-Id")

      Turbolinks.visit(window.location.pathname)

      return this
    })
  }
}


