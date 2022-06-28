// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import des middleware auth et multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import des controleurs
const sauceCtrl = require('../controllers/sauce');

// Définition des routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Export du router
module.exports = router;