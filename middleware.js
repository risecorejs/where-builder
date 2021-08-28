const WhereBuilder = require(__dirname + '/Where-Builder')

module.exports = () => (req, res, next) => {
  req.whereBuilder = (abstractions) => {
    try {
      const whereBuilder = new WhereBuilder(req.query, abstractions)

      whereBuilder.run()

      return whereBuilder.where
    } catch (err) {
      console.log(err)

      return {}
    }
  }

  next()
}
