// Import des packages
const bcrypt = require('bcrypt');   // Pour crypter le mot de passe
const jwt = require('jsonwebtoken');  // Pour obtenir un token d'authentification
const dotenv = require('dotenv');   // Pour utiliser les variables d'environnement
const emailValidator = require('email-validator');  // Pour valider le format de l'email
const passwordValidator = require('password-validator');  // Pour valider le format du mot de passe
const CryptoJS = require("crypto-js");    // Pour crypter l'email

// Création d'un schema pour le password
const schema = new passwordValidator();
// Ajout des propriétés au schema password
schema
  .is().min(8)
  .is().max(16)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()
  .has().symbols()

// Configure l'environnement de variables
dotenv.config();

// Import du modèle user
const User = require('../models/user');

// Middleware de création d'un nouveau user
exports.signup = (req, res) => {
  if (!emailValidator.validate(req.body.email)) {             // Test la validité de l'email avec email-validator
    return res.status(400).json({error: 'invalid email'});
  }

  if (!schema.validate(req.body.password)) {                  // Test la validité du mot de passe avec password-validator
    return res.status(400).json({error: schema.validate(req.body.password, {details: true})});  // Renvoie un tableau avec les détails des critères non respectés sur le mot de passe

  } else {
    const encryptedEmail = CryptoJS.HmacSHA256(req.body.email, process.env.CRYPTO_PASSWORD).toString(); // Cryptage de l'email
    bcrypt.hash(req.body.password, 10)  // Hashage du mot de passe avec bcrypt
        .then(hash => {
            const user = new User({     // Création du nouveau user
                email: encryptedEmail,  // Email crypté
                password: hash          // Password issu du hashage
            });
            user.save()                 // Sauvegarde du user
                .then(() => res.status(201).json({message: 'User created'}))  // Création de ressource
                .catch(error => res.status(500).json({error}))  // Erreur serveur
        })
        .catch(error => res.status(500).json({error})); // Erreur serveur
  }
    
};

// Middleware de connection d'un user existant
exports.login = (req, res) => {
    const cryptedEmail = CryptoJS.HmacSHA256(req.body.email, process.env.CRYPTO_PASSWORD).toString(); // Cryptage de l'email
    User.findOne({email: cryptedEmail}) // Recherche dans la base de données de l'email crypté de la requête
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
              token: jwt.sign(                    // Création du token avec jsonwebtoken à partir de l'userId avec une clé d'encodage et un délai d'expiration
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