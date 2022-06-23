// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import des middleware auth et multer
const auth = require('../middleware/auth');

// Import des controleurs
const likeCtrl = require('../controllers/like');

// Définition des routes
router.post('/:id/like', auth, likeCtrl.likeStatus);

// Export du router
module.exports = router;