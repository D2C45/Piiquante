// Import du modèle sauce
const Sauce = require('../models/sauce');

// Import du package fs
const fs = require('fs');

// Import de la fonction removeImageFile
const functions = require('../functions/functions');

// Enregistrement d'une nouvelle sauce
exports.createSauce = (req,res) => {
    const sauceObject = JSON.parse(req.body.sauce); // Conversion du corps de la requête en objet json
    delete sauceObject._id;     //  Suppression de l'id renvoyé par le frontend

    if (sauceObject.userId == req.token.userId) { // Test si l'userId de la requête correspond au token d'authentification
      const sauce = new Sauce({
          ...sauceObject,         // Copie tous les éléments de l'objet json dans la nouvelle instance
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,    // Récupère l'url de l'image de manière dynamique
      });
      sauce.save()    // Enregistrement de la nouvelle sauce dans la base de données
          .then(() => res.status(201).json({ message: 'Sauce saved'}))    // Création de ressource
          .catch(error => res.status(400).json({ error }));               // Mauvaise requête

    } else {
      functions.removeImageFile(req, res);  // Supprime le fichier crée inutilement par multer et renvoie un message d'erreur
    }
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))         // Requête ok
      .catch(error => res.status(400).json({ error }));     // Mauvaise requête
};

// Récupération d'une sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))         // Requête ok
      .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};

// Modification d'une sauce
exports.modifySauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })                 // Recherche de la sauce avec l'id
      .then (sauce => {

        if (sauce.userId == req.token.userId) {           // Test si le userId du token correspond à celui de la sauce à modifier

          if (req.file) {                                 // Test si présence d'un fichier dans la requête
            let filename = sauce.imageUrl.split('/images/')[1];   // Récupération du nom du fichier
            fs.unlink(`images/${filename}`, () => {                 // Suppression du fichier dans le dossier images
              const sauceObject = {                                 // Création du nouvel objet sauce
                ...JSON.parse(req.body.sauce),                      // Conversion du corps de la requête en objet json
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Mise à jour de l'url de la nouvelle image
              }
              Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Récupère la sauce avec l'id passé en paramètre et la remplace par le nouvel objet sauce créé auquel on rajoute le même id
                .then(() => res.status(200).json({ message: 'Sauce modified'})) // Requête ok
                .catch(error => res.status(400).json({ error }));               // Mauvaise requête
            })

          } else {                                                                          // Si pas de fichier dans la requête
            Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })    // Rempacement par le corps de la requête
              .then(() => res.status(200).json({ message: 'Sauce modified'})) // Requête ok
              .catch(error => res.status(400).json({ error }));               // Mauvaise requête
          }

        } else {                                  // Si l'utilisateur n'est pas celui qui a créé la sauce
          if (req.file) {                         // Si présence d'un fichier dans la requête
            functions.removeImageFile(req, res);  // Supprime le fichier crée inutilement par multer et renvoie un message d'erreur
          } else {                                // Si absence de fichier dans la requête
            res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée
          }          
        }
      })
      .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};

// Suppression du sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({_id: req.params.id})                   // Recherche de la sauce avec l'id
    .then (sauce => {
      if (sauce.userId == req.token.userId) {           // Test si le userId du token correspond à celui de la sauce à modifier
        let filename = sauce.imageUrl.split('/images/')[1];   // Récupération du nom du fichier
        fs.unlink(`images/${filename}`, () => {                 // Suppression du fichier dans le dossier images
          Sauce.deleteOne({_id: req.params.id})                 // Suppression de la sauce
            .then(() => res.status(200).json({ message : "Sauce deleted"})) // Requête ok
            .catch(error => res.status(400).json({error}));                 // Mauvaise requête
        })
      } else {
        res.status(403).json({ error: "Unauthorized request" });
      }
    })
    .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
}