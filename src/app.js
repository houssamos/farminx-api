const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const regionsRoutes = require("./routes/regions.routes");
const culturesRoutes = require("./routes/cultures.routes");
const statsRoutes = require("./routes/stats.routes");
const importRoutes = require("./routes/import.routes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/regions", regionsRoutes);
app.use("/api/cultures", culturesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/import", importRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("../docs/swagger.json")));

app.get("/", (req, res) => res.send("Bienvenue sur l'API Farminx Stats"));

module.exports = app;