const Sauce = require('../models/sauce');
const fs = require ('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // Id supprimé (généré par MongoDB)
    const sauce = new Sauce({ // Nouvelle sauce
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${$req.file.filename}`
  } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id:req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  };


exports.deleteSauce = (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; // Vient récuperer le nom du fichier dans un tableau [1], [0] = avant le /images
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été supprimée ! '}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
  
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

  exports.likeSauce = (req, res, next) => {

    let like = req.body.like // Récupération like
    let sauceId = req.params.id // Récupération de l'id de la sauce
    let userId = req.body.userId // Récupération de l'id utilisateur (Vérification pour que celui-ci like qu'une fois)
    
    if ( like === 1 ) { // Si like = 1, l'utilisateur aime (= like) la sauce / Strictement égal à 1
      // On utilise updateOne pour actualiser les likes
      Sauce.updateOne(

      { _id: sauceId }, // Récupération de l'id de la sauce
      { $push: { usersLiked: userId }, $inc: { likes: +1 }, } // On envoie les données dans le tableau (ID UTILISATEUR + LIKE), incrémentation de 1
      )

        .then(() => res.status(200).json({ message: 'Vous avez liké cette sauce.' }))
        .catch((error) => res.status(400).json({ error }));
        // Testé et fonctionne correctement
    }

    if ( like === -1 ) { //  Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce / Strictement égal à -1
      Sauce.updateOne(

        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }, } // Tableau Disliked
        )
  
          .then(() => res.status(200).json({ message: 'Vous avez disliké cette sauce.' }))
          .catch((error) => res.status(400).json({ error }));
          // Testé et fonctionne correctement
    }

    if ( like === 0 ) { // Si like = 0, l'utilisateur annule son like ou son dislike. / Strictement égal à 0

      // 2 possibilités : soit il annule un like, soit il annule un dislike
      Sauce.findOne({ _id: sauceId }) // On récupère l'id de la sauce

      .then((sauce) => {

        if ( sauce.usersLiked.find(user => user === userId) ) { // Dans le cas ou l'utilisateur annule un like... / Recherche de correspondance
          // Si l'user === à son id alors autoriser l'annulation
          Sauce.updateOne(

            { _id: sauceId },
            { $push: { usersLiked: userId }, $inc: { likes: +1 }, }
            )
      
              .then(() => res.status(200).json({ message: 'Vous avez annulé le like de cette sauce.' }))
              .catch((error) => res.status(400).json({ error }));
              // Testé et fonctionne correctement
        }
  
        if ( sauce.usersDisliked.find(user => user === userId) ){ // Dans le cas ou l'utilisateur annule un dislike... / Recherche de correspondance
          Sauce.updateOne(

            { _id: sauceId },
            { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }, }
            )
      
              .then(() => res.status(200).json({ message: 'Vous avez annulé le dislike de cette sauce.' }))
              .catch((error) => res.status(400).json({ error }));
              // Testé et fonctionne correctement
        }  
      });
    }
};