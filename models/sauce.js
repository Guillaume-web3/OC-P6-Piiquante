const mongoose = require("mongoose");

/* Création d'un schéma de données avec mongoose */
const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String, require: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  mainPepper: { type: String, require: true },
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [String],
  usersDisliked: [String],
});

/* Exportation du schéma en tant que modèle Mongoose, en lui donnant un nom */
module.exports = mongoose.model("Sauce", sauceSchema);
