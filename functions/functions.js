// Import du package fs
const fs = require('fs');

/**
 * Normalize a port into a number, string, or false.
 */
 exports.normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  };

  /**
 * Recherche et gère les différentes erreurs de manière appropriée
 * @param {*} error 
 */
exports.errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

/**
 * Supprime le fichier crée par multer si la requête échoue
 * @param {object} req la requête
 */
exports.removeImageFile = (req, res) => {
  fs.unlink(`images/${req.file.filename}`, () => {                 // Suppression du fichier créé par multer dans le dossier images
    res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée        
  }) 
}