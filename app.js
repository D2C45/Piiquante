// Import des packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configure l'environnement de variables
dotenv.config();

// Import des routers
const userRoutes = require('./routes/user');

// Déclaration de l'application
const app = express();

// Extraction du corps JSON des requêtes POST
app.use(express.json());

// Connection à la base de données MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.lkmitnl.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('Connection to MongoDB failed'));

// Définition des headers de la réponse
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

// Enregistrement des routers
app.use('/api/auth', userRoutes);

// Exporte l'application
module.exports = app;