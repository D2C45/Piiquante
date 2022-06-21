// Import des packages
const mongoose = require('mongoose');

// Définition du schéma de données sauce avec mongoose
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type: String},
    heat: {type: Number},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [userId]},
    usersDisliked: {type: [userId]}
})

// Exporte le schéma en tant que modèle mongoose nommé Sauce
module.exports = mongoose.model('Sauce', sauceSchema);