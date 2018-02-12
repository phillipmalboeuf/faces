

class User extends Model {

  endpoint = "users"

  constructor() {
    super()

    this.id = Cookies.get("User-Id")
  }
}