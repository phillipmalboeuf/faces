


const Upload = {

  headers() {
    return {
      'Accept': 'application/json',
      'X-Session-Secret': Cookies.get('Session-Secret')
    }
  },

  upload(file) {
    let data = new FormData()
    data.append("file", file)

    return fetch('/_upload',
      {
        headers: this.headers(),
        credentials: 'include',
        method: 'POST',
        body: data
      }).then( (response) => {
        if (response.ok) {
          return response.json().then((json) => {
            return json
          })
        } else {
          return response.json().then((json) => {
            console.error(json)
          })
        }
      })
  }
}

