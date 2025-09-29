import express from "express";
import fetch from "node-fetch";
import { createSession, createUserRecord } from "../utils/session.js";
import { getStore, saveStore } from "../config/db.js";

const router = express.Router();

// Step 1: Get Google auth URL
router.get("/url", (req, res) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file profile email"
  );
  const redirect_uri = `${process.env.BASE_URL}/auth/google/finish`;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&scope=${scope}&access_type=offline&prompt=consent`;
  res.json({ authUrl });
});

// Step 2: Exchange code for tokens
router.post("/finish", async (req, res) => {
  const { redirectUrl } = req.body;
  try {
    const url = new URL(redirectUrl);
    const code = url.searchParams.get("code");
    if (!code) return res.status(400).json({ message: "Missing code" });

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/auth/google/finish`,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) return res.status(400).json({ error: tokenJson });

    const userId = createUserRecord();
    const store = getStore();
    store.users[userId].google = tokenJson;
    saveStore();

    const sessionToken = createSession(userId);
    return res.json({ sessionToken, message: "Google connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
