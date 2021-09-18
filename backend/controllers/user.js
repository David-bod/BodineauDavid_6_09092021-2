const bcrypt = require('bcrypt'); // bcrypt gère le hash des mots de passes
const jwt = require('jsonwebtoken'); // jsonWebToken permet de créer des tokens

const User = require('../models/User');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 13) // Récupère le mot de passe et le hash > 13 passages /
    .then(hash => {
        const user = new User({  // On récupère l'email et le mot de passe(hash)
            email: req.body.email,
            password: hash
        });
        user.save() //Enregistre dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // On recherche l'adresse mail dans la base de données
    .then(user => {
        if (!user){
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid){
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({  // L'utilisateur a entré le bon mot de passe
                userId: user._id, // On renvoie un userID + un token d'authentification
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};