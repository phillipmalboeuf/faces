
const Cookies = {

  set(name, value, expiry_days) {
    let d = new Date()
    d.setTime(d.getTime()+(expiry_days*24*60*60*1000))
    document.cookie = "X-" + name + "=" + value + "; expires=" + d.toGMTString() + "; path=/"
  },

  get(name) {
    name = "X-" + name + "="
    let cookies = document.cookie.split(';')

    for (var i = cookies.length - 1; i >= 0; i--) {
      const cookie = cookies[i].trim()
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length)
        break
      }
    }

    return false
  },

  delete(name) {
    document.cookie = 'X-' + name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
  }
}

