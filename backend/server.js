const express = require("express");
const app = express();
const eleves_routes = require("./routes/eleves.js");
const cours_routes = require("./routes/cours.js");
const classes_routes = require("./routes/classes.js");

app.use(express.json());

app.use("/eleves", eleves_routes);
app.use("/cours", cours_routes);
app.use("/classes", classes_routes);

app.listen(3001, () => {
  console.log("Serveur démarré sur le port 3001");
});