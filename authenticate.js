const jwt = require('jsonwebtoken')

module.exports.getToken = function (cardId, employeeId) {
  token = jwt.sign({ card_id: cardId, employee_id: employeeId}, 'SecretCode', {
    expiresIn : 900 //seconds
  });
  return token
}

module.exports.auth = function (req, res, next) { 
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, 'SecretCode', async (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      req.user = user
      next()
    })
};