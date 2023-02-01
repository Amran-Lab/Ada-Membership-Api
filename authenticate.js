const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.getToken = function (cardId, employeeId) {
  token = jwt.sign({ card_id: cardId, employee_id: employeeId }, process.env.SECRET_KEY, {
    expiresIn: 900 //seconds
  });
  return token
}

module.exports.auth = function (req, res, next) {
  const header = req.headers['authorization']

  if (header == null) {
    return res.status(401).send({ error: 'Token Not Provided'})
  }

  token = header.split(' ')[1]

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(403).send({ error: 'Invalid Token'})
    }
    
    req.user = user
    next()
  })
};