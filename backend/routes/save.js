/* eslint-env node */

import express from "express";
import fetch from "node-fetch";
import { requireAuth } from "../middleware/auth.js";
import { getUser } from "../utils/session.js";

const router = express.Router();

// Save to Notion
router.post("/notion", requireAuth, async (req, res) => {
  const user = getUser(req.userId);
  if (!user?.notion?.access_token) return res.status(400).json({ message: "Notion not connected" });

  const { text, meta } = req.body;

  try {
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.notion.access_token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { type: "workspace", workspace: true },
        properties: {
          title: { title: [{ text: { content: meta.title || "Snippet" } }] },
        },
        children: [
          { object: "block", type: "paragraph", paragraph: { rich_text: [{ text: { content: text } }] } },
          { object: "block", type: "paragraph", paragraph: { rich_text: [{ text: { content: `${meta.url} • ${meta.timestamp}` } }] } },
        ],
      }),
    });

    const json = await r.json();
    if (!r.ok) return res.status(500).json({ error: json });
    res.json({ message: "Saved to Notion", data: json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Save to Google Drive
router.post("/drive", requireAuth, async (req, res) => {
  const user = getUser(req.userId);
  if (!user?.google?.access_token) return res.status(400).json({ message: "Google not connected" });

  const { text, meta } = req.body;
  const docId = process.env.GOOGLE_DOC_ID;

  if (!docId) {
    console.log("[SIM] Save to Drive:", text, meta);
    return res.json({ message: "Simulated saved to Drive (no doc configured)" });
  }

  try {
    const batch = {
      requests: [
        {
          insertText: {
            location: { index: 1e9 },
            text: `\n${meta.title}\n${text}\n${meta.url} • ${meta.timestamp}\n---\n`,
          },
        },
      ],
    };

    const r = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.google.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });

    const json = await r.json();
    if (!r.ok) return res.status(500).json({ error: json });
    res.json({ message: "Saved to Google Doc", data: json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
