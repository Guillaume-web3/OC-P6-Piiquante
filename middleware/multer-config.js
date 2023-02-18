/* Importation du package multer */
const multer = require("multer");

/* Dictionnaire des mimetypes */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* Objet de configuration pour multer */
const storage = multer.diskStorage({
  // Utilisation de la fonction multer pour enregistrement sur le disque
  destination: (req, file, callback) => {
    // Indique où enregistrer le fichier
    callback(null, "images"); // Null = pas d'erreur
  },
  filename: (req, file, callback) => {
    // Indique quel nom de fichier utiliser
    const name = file.originalname.split(" ").join("_"); // split permet de séparer les composants du nom (séparé par un espace) et de les ranger dans un tableau. join permet de rassembler les éléments de ce tableau avec un séparateur "_"
    const extension = MIME_TYPES[file.mimetype]; // Utilise le mimetype pour créer l'extension
    callback(null, name + Date.now() + "." + extension); // Créé le nom final avec name, la date du jour à la miliseconde et l'extension. Null = pas d'erreur
  },
});

/* Exportation du middelware */
module.exports = multer({ storage }).single("image");
