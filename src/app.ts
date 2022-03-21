import express from "express";
import cors from "cors";
import "dotenv/config";
import dbConnection from "./db/config";

const port = process.env.port || 3000;

const app = express();
app.use(express.json());
app.use(cors());

dbConnection();
app.use("/api/login", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
