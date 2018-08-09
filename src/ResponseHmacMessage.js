const crypto = require('crypto')

class ResponseHmacMessage {
    constructor(response) {
      this.response = response
    }

    getHmacMessage() {
      return {
        bodyDigest: crypto.createHash('md5').update(this.response.body).digest('hex'),
        requestUri: this.response.request.uri.pathname, // TODO: include query string for GET requests
        contentType: this.response.headers['content-type'],
        date: this.response.headers['x-date'],
        method: this.response.request.method
      };
    }
  }
  module.exports = ResponseHmacMessage