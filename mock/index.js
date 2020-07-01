const {demo1, demo2} = require('./db/index.js')

const mockData = {
  'GET /users': demo1,
  'GET /customers': demo2,
}
module.exports = mockData

