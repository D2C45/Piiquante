// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import des controleurs
const userCtrl = require('../controllers/user');

// Définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export du router
module.exports = router;