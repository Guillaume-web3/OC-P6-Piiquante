const mongoose = require("mongoose");

/* Création d'un schéma de données avec mongoose */
const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String },
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: String },
  usersDisliked: { type: String },
});

/* Exportation du schéma en temps que modèle Mongoose, en lui donnant un nom */
module.exports = mongoose.model("Sauce", sauceSchema);
