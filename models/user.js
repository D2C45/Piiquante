// Import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma de données user avec mongoose
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Applique le plugin uniqueValidator au schéma pour que l'email soit unique
userSchema.plugin(uniqueValidator);

// Exporte le schéma en tant que modèle mongoose nommé User
module.exports = mongoose.model('User', userSchema);