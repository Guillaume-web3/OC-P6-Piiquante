const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  console.log("Création de la sauce");
  const sauceObject = JSON.parse(req.body.sauce); // Transforme la chaine de caractere contenu dans le corps
  delete sauceObject._id; // Suppression de l'id, qui sera généré automatiquement par la BDD
  delete sauceObject._userId; // Suppression de l'userId, remplacé par l'userId du token d'autentification (pour des raisons de sécurités)
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Génération de l'url
  });

  sauce
    .save() // Enregistrement du nouvel objet dans la BDD
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file // Si il y a un champ "file" dans l'objet req, et donc qu'il y a un fichier
    ? {
        ...JSON.parse(req.body.sauce), // Transforme la chaine de caractere contenu dans le corps
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // Création de l'url de l'image
      }
    : { ...req.body }; // Si il n'y a pas de fichier dans la requete, on récupere l'objet directement

  delete sauceObject._userId; // On supprime l'userId de la requete (sécurité pour empecher qqun de réatribuer un objet à qqun d'autre)
  Sauce.findOne({ _id: req.params.id }) // Recherche de l'objet dans la BDD afin de vérifier que c'est bien l'utilisateur à qui appartient cet objet qui chercher à le modifier
    .then((sauce) => {
      // Récupération de l'objet
      if (sauce.userId != req.auth.userId) {
        // Vérification de l'userId par rapport a l'userId de la BDD (du token)
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Si c'est le bon utilisateur
        Sauce.updateOne(
          // Mise à jour de l'enregistrement
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        // Vérification de l'userId par rapport a l'userId de la BDD (du token)
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Si c'est le bon utilisateur
        const filename = sauce.imageUrl.split("/images/")[1]; // Récupération du nom du fichier
        fs.unlink(`images/${filename}`, () => {
          // Suppression du fichier
          Sauce.deleteOne({ _id: req.params.id }) // Suppression de l'enregistrement dans la BDD
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
