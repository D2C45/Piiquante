// Import du modèle sauce
const Sauce = require('../models/sauce');

exports.likeStatus = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {
            let haveUserAlreadyLiked = sauce.usersLiked.find(user => user == req.body.userId);          // Prend la valeur de l'userId (qui peut être convertie en true) si il a déjà like sinon undefined
            let haveUserAlreadyDisliked = sauce.usersDisliked.find(user => user == req.body.userId);    // Prend la valeur de l'userId si il a déjà dislike (qui peut être convertie en true) sinon undefined

            if (!haveUserAlreadyLiked && !haveUserAlreadyDisliked) {        // Si l'utilisateur n'a pas encore like ou dislike
                switch(req.body.like) {
                    case 1:                                                 // Si l'utilisateur like
                        sauce.likes += 1;                                   // Ajoute 1 aux likes
                        sauce.usersLiked.push(req.body.userId);             // Ajoute le userId dans usersLiked
                        break;
                    case -1:                                                // Si l'utilisateur dislike
                        sauce.dislikes += 1;                                // Ajoute 1 aux dislikes
                        sauce.usersDisliked.push(req.body.userId);          // Ajoute le userId dans usersDisliked
                        break;
                    default:
                        res.status(400).json({ message: 'Invalid value, value must be 1 or -1'});
                }
            }

            if (haveUserAlreadyLiked) {                                     // Si l'utilisateur a déjà like
                let index = sauce.usersLiked.indexOf(req.body.userId);      // Récupère l'index du user dans usersLiked
                switch(req.body.like) {
                    case 0:                                                 // Si l'utilisateur retire son like
                        sauce.likes -= 1;                                   // Soustrait 1 aux likes
                        sauce.usersLiked.splice(index, 1);                  // Retire le userId dans usersLiked
                        break;
                    default:
                        res.status(400).json({ message: 'You have already liked it, remove your like (value = 0) to proceed'});
                }
            }

            if (haveUserAlreadyDisliked) {                                  // Si l'utilisateur a déjà disliker
                let index = sauce.usersDisliked.indexOf(req.body.userId);   // Récupère l'index du user dans usersDisliked
                switch(req.body.like) {
                    case 0:                                                 // Si l'utilisateur retire son dislike
                        sauce.dislikes -= 1;                                   // Soustrait 1 aux dislikes
                        sauce.usersDisliked.splice(index, 1);                  // Retire le userId dans usersDisliked
                        break;
                    default:
                        res.status(400).json({ message: 'You have already disliked it, remove your dislike (value = 0) to proceed'});
                }
            }

            sauce.save()    // Sauvegarde la sauce modifiée
              .then(() => res.status(200).json({ message: 'Like status updated'})) // Requête ok
              .catch(error => res.status(400).json({ error }));               // Mauvaise requête
            })
        .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
}