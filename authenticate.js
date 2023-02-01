const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.getToken = function (cardId, employeeId) {
  token = jwt.sign({ card_id: cardId, employee_id: employeeId}, process.env.SECRET_KEY, {
    expiresIn : 900 //seconds
  });
  return token
}

module.exports.auth = function (req, res, next) { 
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      req.user = user
      next()
    })
};