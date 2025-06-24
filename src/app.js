const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const regionsRoutes = require("./routes/regions.routes");
const culturesRoutes = require("./routes/cultures.routes");
const statsRoutes = require("./routes/stats.routes");
const importRoutes = require("./routes/import.routes");
const authRoutes = require("./routes/auth.routes");
const userAuthMiddleware = require("./middlewares/user-auth.middleware");
const appAuthMiddleware = require("./middlewares/app-auth.middleware");
const universalAuth = require('./middlewares/auth-universal.middleware');
const adminOnly = require('./middlewares/role-admin-only');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("../docs/swagger.json")));

//app.use(userAuthMiddleware); // Middleware d'authentification pour les routes suivantes
app.use(universalAuth); 


app.use("/api/regions", regionsRoutes);
app.use("/api/cultures", culturesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/import", adminOnly({ verifyInDb: true }), importRoutes);

app.get("/", (req, res) => res.send("Bienvenue sur l'API Farminx Stats"));

module.exports = app;
