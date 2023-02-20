const jwt = require("jsonwebtoken"); // Importation de jsonwebtoken

/* Exportation de la fonction */
/* Permet d'extraire les informations contenus dans le token et les transmettre aux autres middleware */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupération du Token uniquement (sans la premiere partie), présent dans le header de la request
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Appel de la méthode "verify" de jsonwebtoken
    const userId = decodedToken.userId; // Récupération du userId, a partir du userId décodé
    req.auth = {
      userId: userId, // Ajout de l'userId à l'objet request, qui sera renvoyé aux routes appelées par la suite
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
