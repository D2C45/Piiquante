// Import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Configure l'environnement de variables
dotenv.config();

// Import du modèle user
const User = require('../models/user');

// Middleware de création d'un nouveau user
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)  // Hashage du mot de passe avec bcrypt
        .then(hash => {
            const user = new User({     // Création du nouveau user
                email: req.body.email,  // Email issu du corps de la requête
                password: hash          // Password issu du hashage
            });
            user.save()                 // Sauvegarde du user
                .then(() => res.status(201).json({message: 'User created'}))  // Créatin de ressource
                .catch(error => res.status(500).json({error}))  // Erreur serveur
        })
        .catch(error => res.status(500).json({error})); // Erreur serveur
};

// Middleware de connection d'un user existant
exports.login = (req, res) => {
    User.findOne({email: req.body.email}) // Recherche dans la base de données de l'email contenu dans la requête
      .then(user => {
        if (!user) {
          return res.status(401).json({error: 'User not found'}); // Message d'erreur si le user n'existe pas dans la base de données (non autorisé)
        }
        bcrypt.compare(req.body.password, user.password) // Comparaison du password contenu dans la requête avec le hash de la base de données
          .then(valid => {
            if (!valid) {
              return res.status(401).json({error: 'Invalid password'}); // Message d'erreur si le mot de passe ne correspond pas (non autorisé)
            }
            res.status(200).json({                // Sinon renvoit un objet json avec l'userId et un token d'authentification
              userId: user._id,
              token: jwt.sign(                    // Création du token à partir de l'userId, d'un mot de passe et un délai d'expiration
                {userId: user._id},
                process.env.TOKEN_PASSWORD,
                {expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({error})); // Erreur serveur
      })
      .catch(error => res.status(500).json({error}));     // Erreur serveur
  };