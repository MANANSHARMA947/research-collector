import express from "express";
import fetch from "node-fetch";
import { createSession, createUserRecord } from "../utils/session.js";
import { getStore, saveStore } from "../config/db.js";

const router = express.Router();

router.get("/url", (req, res) => {
  const client_id = process.env.NOTION_CLIENT_ID;
  const redirect_uri = `${process.env.BASE_URL}/auth/notion/finish`;
  const authUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}`;
  res.json({ authUrl });
});

router.post("/finish", async (req, res) => {
  const { redirectUrl } = req.body;
  try {
    const url = new URL(redirectUrl);
    const code = url.searchParams.get("code");
    if (!code) return res.status(400).json({ message: "Missing code" });

    const resp = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.BASE_URL}/auth/notion/finish`,
        client_id: process.env.NOTION_CLIENT_ID,
        client_secret: process.env.NOTION_CLIENT_SECRET,
      }),
    });

    const json = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: json });

    const userId = createUserRecord();
    const store = getStore();
    store.users[userId].notion = json;
    saveStore();

    const sessionToken = createSession(userId);
    return res.json({ sessionToken, message: "Notion connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
