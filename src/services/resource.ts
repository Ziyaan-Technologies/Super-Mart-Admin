/**
 * Resource class
 * http://www.ruanyifeng.com/blog/2014/05/restful_api.html
 */

import axios from "axios"

export default class Resource {
  private endpoint: string;

  constructor (endpoint: string) {
    this.endpoint = endpoint
  }

  get (id: number, options: object) {
    let url = `/${this.endpoint}`
    if (typeof id === 'object') {
      options = id
    } else if (id !== undefined) {
      url += `/${id}`
    }
    return axios.get(url, options)
  }

  post (options: object) {
    const url = `/${this.endpoint}`
    return axios.post(url, options)
  }

  put (id: number, options: object) {
    const url = `/${this.endpoint}/${id}`
    return axios.put(url, options)
  }

  patch (id: number, options: object) {
    const url = `/${this.endpoint}/${id}`
    return axios.patch(url, options)
  }

  delete (id: number, options: object) {
    const url = `/${this.endpoint}/${id}`
    return axios.delete(url, options)
  }
}
