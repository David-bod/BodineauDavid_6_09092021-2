const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  name: { type: String, required: true }, // name > — nom de la sauce
  manufacturer: { type: String, required: true}, // manufacturer > — fabricant de la sauce
  description: { type: String, required: true }, // description > — description de la sauce
  mainPepper: { type: String, required: true }, // mainPepper > — le principal ingrédient épicé de la sauce
  imageUrl: { type: String, required: true },  // imageUrl > — l'URL de l'image de la sauce téléchargée par l'utilisateur
  userId: { type: String, required: true }, // > userId > — l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
  heat: { type: Number, required: true }, // heat > — nombre entre 1 et 10 décrivant la sauce
  likes: { type: Number, required: false }, // likes > — nombre d'utilisateurs qui aiment (= likent) la sauce
  dislikes: { type: Number, required: false }, // dislikes > nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
  usersLiked: [{ type: String, required: false }], // usersLiked > — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
  usersDisliked: [{ type: String, required: false }], // usersDisliked > — tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);