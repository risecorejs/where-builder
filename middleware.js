const whereBuilder = require('./index')

module.exports = () => (req, res, next) => {
  req.whereBuilder = (...abstractions) => {
    if (Array.isArray(abstractions[0])) {
      abstractions = abstractions[0]
    }

    return whereBuilder(req.query, abstractions)
  }

  next()
}
