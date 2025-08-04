const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocV1 = require("../docs/v1/swagger.json");
const swaggerDocV2 = require("../docs/v2/swagger.json");

const v1RegionsRoutes = require("./routes/v1/regions.routes");
const v1CulturesRoutes = require("./routes/v1/cultures.routes");
const v1StatsRoutes = require("./routes/v1/stats.routes");
const v1ImportRoutes = require("./routes/v1/import.routes");
const v1AuthRoutes = require("./routes/v1/auth.routes");
const recaptchaRoutes = require("./routes/recaptcha.routes");
const universalAuth = require('./middlewares/auth-universal.middleware');
const adminOnly = require('./middlewares/role-admin-only');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/v1/auth", v1AuthRoutes);
app.use(
  "/api-docs/v1",
  swaggerUi.serveFiles(swaggerDocV1),
  swaggerUi.setup(swaggerDocV1)
);
app.use(
  "/api-docs/v2",
  swaggerUi.serveFiles(swaggerDocV2),
  swaggerUi.setup(swaggerDocV2)
);
app.use(
  "/api-docs",
  swaggerUi.serveFiles(swaggerDocV1),
  swaggerUi.setup(swaggerDocV1)
);

app.use('/api', recaptchaRoutes);

// Middleware d'authentification pour les routes suivantes
app.use(universalAuth);


app.use("/v1/regions", v1RegionsRoutes);
app.use("/v1/cultures", v1CulturesRoutes);
app.use("/v1/stats", v1StatsRoutes);
app.use("/v1/import", adminOnly({ verifyInDb: true }), v1ImportRoutes);

app.get("/", (req, res) => res.send("Bienvenue sur l'API Farminx Stats"));

module.exports = app;
