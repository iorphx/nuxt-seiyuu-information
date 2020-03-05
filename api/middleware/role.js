module.exports = function role(roleValue) {
  return function(req, res, next) {
    if (!req.session.authUser) return res.status(401).json({ error: new Error('Unauthorized')})
    else if (req.session.authUser.role !== roleValue) return res.status(401).json({ error: new Error('Unauthorized')})
    else next()
  }
}