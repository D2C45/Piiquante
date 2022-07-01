// Import des packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configure l'environnement de variables
dotenv.config();

// Import des routers
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const likeRoutes = require('./routes/like');

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

// Limite le nombre de requêtes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)


// Sécurisation des headers avec helmet
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Gestion des requêtes images par express de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement des routers
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/api/sauces', likeRoutes);

// Exporte l'application
module.exports = app;