// Import des packages jsonwebtoken et dotenv
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Configure l'environnement de variables
dotenv.config();

// Exporte le middleware de vérification du token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];                  // Récupération du token dans le header authorization
    const decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD);     // Décodage du token
    const userId = decodedToken.userId;                                     // Récupération du userId présent dans le token
    if (req.body.userId && req.body.userId !== userId) {                    // Comparaison du userId de la requête avec celui du token
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {                                     // Capture des erreurs
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};