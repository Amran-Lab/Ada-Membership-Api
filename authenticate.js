const jwt = require('jsonwebtoken')

module.exports.getToken = function (cardId) {
  token = jwt.sign({ _id: cardId}, 'SecretCode', {
    expiresIn : 120 //seconds
  });
  return token
}

module.exports.auth = function (req, res, next) { 
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, 'SecretCode', (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
      console.log(user)
      next()
    })
};