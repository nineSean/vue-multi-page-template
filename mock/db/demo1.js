const {Random} = require('mockjs')
module.exports = (req, res) => {
  const data = {
    users: Array
      .from({length: (5 + Math.floor(Math.random() * 5))}, (_, i) => ({id: i}))
      .map(user => {
        user.name = Random.cname()
        return user
      })
  }
  res.json(data)
}