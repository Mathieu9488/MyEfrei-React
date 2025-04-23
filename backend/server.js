require('dotenv').config({ path: '../.env' });
const express = require("express");
const app = express();
const cors = require("cors");
const login_routes = require("./routes/login.js");
const eleves_routes = require("./routes/admin/eleves.js");
const matieres_routes = require("./routes/admin/matieres.js");
const classes_routes = require("./routes/admin/classes.js");
const professeurs_routes = require("./routes/admin/professeurs.js");
const sessions_routes = require("./routes/admin/sessions.js");
const eleve_eleves_routes = require('./routes/eleves/eleve.js');
const prof_prof_routes = require('./routes/prof/professeur.js');

app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

console.log(process.env.REACT_APP_FRONTEND_URL)

app.use(express.json());

app.use("/login", login_routes);
app.use("/admin/eleves", eleves_routes);
app.use("/admin/matieres", matieres_routes);
app.use("/admin/classes", classes_routes);
app.use("/admin/professeurs", professeurs_routes);
app.use("/admin/sessions", sessions_routes);
app.use("/eleve/eleves", eleve_eleves_routes);
app.use("/prof/professeurs", prof_prof_routes);

app.listen(3001, () => {
  console.log("Serveur démarré sur le port 3001");
});