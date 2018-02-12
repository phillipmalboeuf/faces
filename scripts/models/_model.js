


class Model {

  constructor() {
    this.attributes = {}
  }

  headers() {
    return { 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Session-Secret': Cookies.get('Session-Secret')
    }
  }

  fetch() {
    return fetch(lang_route + this.endpoint + '/' + this.id,
      {
        headers: this.headers(),
        credentials: 'include',
        method: 'GET'
      }).then( (response) => {
        if (response.ok) {
          return response.json().then((json) => {
            this.id = json._id
            this.attributes = json

            return this
          })
        } else {
          return response.json().then((json) => {
            
            throw new Error(`${json.message}: ${json.description}`)
          })
        }
      }).then( (json) => {
        this.attributes = json
        return this
      })
  }

  save(data) {
    let url = lang_route + this.endpoint
    let method = 'POST'

    if (this.id) {
      url += '/' + this.id
      method = 'PUT'  
    }

    return fetch(url,
      {
        headers: this.headers(),
        method: method,
        credentials: 'include',
        body: JSON.stringify(data)
      }).then( (response) => {
        if (response.ok) {
          return response.json().then((json) => {
            this.id = json._id
            this.attributes = json

            return this
          })
        } else {
          return response.json().then((json) => {
            
            throw new Error(`${json.message}: ${json.description}`)
          })
        }
      })
  }

  destroy() {

    return fetch(lang_route + this.endpoint + '/' + this.id,
      {
        headers: this.headers(),
        credentials: 'include',
        method: 'DELETE'
      }).then( (response) => {
        if (response.ok) {
          return response.json().then((json) => {
            this.id = undefined
            this.attributes = {}

            return this
          })
        } else {
          return response.json().then((json) => {
            
            throw new Error(`${json.message}: ${json.description}`)
          })
        }
      })
  }

}