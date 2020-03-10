module.exports = function role(roleArr) {
  return function(req, res, next) {
    if (!req.session.authUser) return res.status(401).json({ error: new Error('Unauthorized')})
    else if (!roleArr.includes(req.session.authUser.role)) return res.status(401).json({ error: new Error('Unauthorized')})
    else next()
  }
}