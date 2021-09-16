const Sauce = require('../models/sauce');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const thing = new Thing({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${$req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  { 
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${$req.file.filename}`
  } : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...sauceObject, _id:req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  };


exports.deleteSauce = (req, res, next) => {  Thing.deleteOne({ _id: req.params.id })
.then(thing => res.status(200).json(thing))
.catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
  
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };