const axios = require('axios');

const functions = {
    get: () => axios.get('http://localhost:4000/api/books/5ff35fe302df70cae14b7c45')
        .then(res => res.body)
        .catch(err => 'error')
}

module.exports = functions;