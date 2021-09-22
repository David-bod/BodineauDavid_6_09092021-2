const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, stuffCtrl.createSauce); // Méthode POST pour pouvoir créer des objets dans la BDD
router.put('/:id', auth, multer, stuffCtrl.modifySauce); // Méthode PUT pour pouvoir modifier des objets dans la BDD
router.delete('/:id', auth, stuffCtrl.deleteSauce); // Méthode DELETE pour supprimer un objets dans la BDD
router.get('/:id', auth, stuffCtrl.getOneSauce); // Méthode dynamique qui renvoi l'id lorsque l'on clique sur l'objet à vendre
router.get('/', auth, stuffCtrl.getAllSauces); // Méthode qui récupère les données sur la page d'accueil

router.post('/:id/like', auth, stuffCtrl.likeSauce); // Méthode pour gérer les likes et dislikes d'une sauce


module.exports = router;