// Import du modèle sauce
const Sauce = require('../models/sauce');

exports.likeStatus = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {

            if(req.body.userId) {   // Test si présence d'un userId dans la requête
                let haveUserAlreadyLiked = sauce.usersLiked.find(user => user == req.body.userId);          // Prend la valeur de l'userId (qui peut être convertie en true) si il a déjà like sinon undefined
                let haveUserAlreadyDisliked = sauce.usersDisliked.find(user => user == req.body.userId);    // Prend la valeur de l'userId si il a déjà dislike (qui peut être convertie en true) sinon undefined

                try{        // Bloc de test
                    if (req.body.like === 1 || req.body.like === 0 || req.body.like === -1) {   // N'autorise que -1,0 et 1 comme valeurs

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
                                    throw new Error('No like, no dislike');             // Renvoie une nouvelle erreur
                            }
                        }

                        if (haveUserAlreadyLiked) {                                     // Si l'utilisateur a déjà like
                            let index = sauce.usersLiked.indexOf(req.body.userId);      // Récupère l'index du user dans usersLiked
                            switch(req.body.like) {
                                case 0:                                                 // Si l'utilisateur retire son like
                                    sauce.likes -= 1;                                   // Soustrait 1 aux likes
                                    sauce.usersLiked.splice(index, 1);                  // Retire le userId dans usersLiked
                                    break;
                                case 1:
                                    throw new Error('You have already liked it');       // Renvoie une nouvelle erreur
                                default:
                                    throw new Error('You have already liked it, remove your like (value = 0) before adding a dislike'); // Renvoie une nouvelle erreur
                            }
                        }

                        if (haveUserAlreadyDisliked) {                                  // Si l'utilisateur a déjà disliker
                            let index = sauce.usersDisliked.indexOf(req.body.userId);   // Récupère l'index du user dans usersDisliked
                            switch(req.body.like) {
                                case 0:                                                 // Si l'utilisateur retire son dislike
                                    sauce.dislikes -= 1;                                   // Soustrait 1 aux dislikes
                                    sauce.usersDisliked.splice(index, 1);                  // Retire le userId dans usersDisliked
                                    break;
                                case -1:
                                    throw new Error('You have already disliked it');        // Renvoie une nouvelle erreur
                                default:
                                    throw new Error('You have already disliked it, remove your dislike (value = 0) before adding a like');  // Renvoie une nouvelle erreur
                            }
                        }

                        sauce.save()    // Sauvegarde la sauce modifiée
                            .then(() => res.status(200).json({ message: 'Like status updated'})) // Requête ok
                            .catch(error => res.status(400).json({ error }));               // Mauvaise requête

                    } else {    // Si autre chose que -1,0 ou 1 est envoyé, renvoie un message d'erreur
                        res.status(400).json({ message: 'Invalid value of like, must be -1,0 or 1'});
                    }
                }
                catch(error){       // Récupération de l'erreur si échec dans le try
                    res.status(400).json({ message: error.message});
                }
            } else {    // Si pas de userId dans la requête
                res.status(400).json({ message: 'You must had a userId to like or dislike'});
            }
        
        })

        .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
}