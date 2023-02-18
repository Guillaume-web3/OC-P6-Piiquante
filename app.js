/* Utilisation d'Express */
const express = require("express");
const app = express();

/* Importation de Mongoose */
const mongoose = require("mongoose");

/* Importation des routeurs */
const userRoutes = require("./roots/user");
const sauceRoutes = require("./roots/sauce");

/* Acces au path du serveur */
const path = require("path");

/* Connection au Cloud de MongoDN avec mongoose*/
mongoose
  .connect(
    "mongodb+srv://GuillaumeWeb3:guillaume@cluster0.s0imbcl.mongodb.net/Piiquante",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !" + err.message));

/* Permet à Express de prendre toutes les requêtes qui ont un Content-Type "application/json" et met à disposition leur body directement sur l'objet req */
app.use(express.json());

/* Gere les erreurs de CORS - S'applique à toutes les routes */
app.use((req, res, next) => {
  console.log("Gestion des CORS");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet d'accéder à notre API depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Permet d'ajouter les headers mentionnées aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Permet d'envoyer des requêtes avec les méthodes mentionnées
  console.log("CORS OK");
  next();
});

/* Mise en place des routes */
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

/* Exportation via Express */
module.exports = app;
