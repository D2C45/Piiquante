// Import du package multer
const multer = require('multer');

// Dictionnaire des extensions de fichiers en fonction du MIME TYPE
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du storage de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');       // Définition du dossier où enregistrer les fichiers
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');    // Remplacement des espaces par des underscores dans le nom du fichier original
    const extension = MIME_TYPES[file.mimetype];            // Récupération de l'extension de fichiers appropriée
    cb(null, name + Date.now() + '.' + extension);          // Nommage du fichier avec name + timestamp + extension pour le rendre unique
  }
});

// Exporte multer configuré avec storage et uniquement pour le téléchargement de fichiers image
module.exports = multer({storage: storage}).single('image');