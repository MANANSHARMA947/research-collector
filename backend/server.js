import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import googleAuthRoutes from "./routes/authGoogle.js";
import notionAuthRoutes from "./routes/authNotion.js";
import saveRoutes from "./routes/save.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => res.json({ ok: true }));

// Routes
app.use("/auth/google", googleAuthRoutes);
app.use("/auth/notion", notionAuthRoutes);
app.use("/api/save", saveRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
