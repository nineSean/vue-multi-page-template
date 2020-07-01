const {Random} = require('mockjs')
const data = {
  foreigners: Array
    .from({length: (3 + Math.floor(Math.random() * 2))}, (_, i) => ({id: i}))
    .map(user => {
      user.name = Random.name()
      return user
    })
}
module.exports = data
