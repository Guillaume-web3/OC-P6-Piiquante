const bcrypt = require("bcrypt"); // Importation du package de cryptage
const jwt = require("jsonwebtoken"); // Importable du package de webtokens

const User = require("../models/user"); // Importation du modèle pour User

/* Utilisation de la méthode signup */
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // fonction de hachage (asynchrone) 10 => nombre de tours de hachage. Plus il est haut, plus c'est sécurisé (mais plus c'est long)
    .then((hash) => {
      const user = new User({
        // Création d'un nouvel utilisateur à partir du modèle mangoose
        email: req.body.email, // Récupération de l'adresse email dans le corp de la requete
        password: hash, // Récupération du mot de passe crypté
      });
      user
        .save() // Utilisation de la méthode save pour enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur crée!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/* Utilisation de la méthode login */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche une correspondance entre l'adresse email dans le corp de la requete et les champs email de la base de données (retourne une promesse)
    .then((user) => {
      // Récupération de la valeur trouvée par la requete
      if (user === null) {
        // Si nul => pas présent dans la BDD
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte" }); // Message volontairement flou pour des raisons de confidentialité
      } else {
        // Si on a une valeur :
        bcrypt
          .compare(req.body.password, user.password) // Utilisation de la méthode "compare" de bcrypt : comparaison du mot de passe de la BDD avec celui du corps de la requete
          .then((valid) => {
            if (!valid) {
              // Si false : erreur d'authentification
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              // Si true : authentification réussi
              res.status(200).json({
                // Création d'un objet contenant les informations necessaires à l'authentification pour les futures requetes
                userId: user._id, // Création d'un userId
                token: jwt.sign(
                  // Utilisation de la fonction sign de jsonwebtoken
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET", // Clé d'encodage. Simple ici pour le développement, en production on utiliserait une chaine de caractere beaucoup plus longue et completement aléatoire
                  { expiresIn: "7d" } // Expiration du Token, en seconde
                ),
              });
            }
          })
          .catch((error) => {
            // Si erreur d'exécution dans la base de données
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      // Si erreur d'exécution dans la base de données
      res.status(500).json({ error }); // Envoie d'un code "erreur serveur" avec le message d'erreur
    });
};
