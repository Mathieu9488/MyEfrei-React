const express = require("express");
const app = express();
const eleves_routes = require("./routes/admin/eleves.js");
const cours_routes = require("./routes/admin/cours.js");
const classes_routes = require("./routes/admin/classes.js");
const login_routes = require("./routes/login.js");

app.use(express.json());

app.use("/admin/eleves", eleves_routes);
app.use("/admin/cours", cours_routes);
app.use("/admin/classes", classes_routes);
app.use("/login", login_routes);

app.listen(3001, () => {
  console.log("Serveur démarré sur le port 3001");
});