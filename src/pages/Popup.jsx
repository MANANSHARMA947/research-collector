/* global chrome */
import React, { useEffect, useState } from "react";

export default function Popup() {
  const [backendUrl, setBackendUrl] = useState("");
  const [sessionToken, setSessionToken] = useState(null);
  const [connected, setConnected] = useState({ google: false, notion: false });

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["backendUrl", "sessionToken"], (res) => {
        setBackendUrl(res.backendUrl || "");
        setSessionToken(res.sessionToken || null);
        // check backend for connection status if token present
        if (res.sessionToken) checkConnections(res.backendUrl || "http://localhost:4000", res.sessionToken);
      });
    }
  }, []);

  async function checkConnections(url = backendUrl || "http://localhost:4000", token) {
    if (!token) return;
    try {
      const r = await fetch(`${url}/api/me`, { headers: { Authorization: `Bearer ${token}` }});
      if (r.ok) {
        const j = await r.json(); // { google: true/false, notion: true/false }
        setConnected(j);
      } else {
        setConnected({ google: false, notion: false });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Launch webAuthFlow for provider ('google' or 'notion')
  async function startAuth(provider) {
    const clientIdKey = provider === "google" ? "GOOGLE_CLIENT_ID" : "NOTION_CLIENT_ID";
    // The extension will call backend to get a provider-specific authorize URL (optional).
    // Here we'll fetch a dynamic auth URL from backend to avoid building URLs in extension.
    const base = backendUrl || "http://localhost:4000";
    try {
      const resp = await fetch(`${base}/auth/${provider}/url`);
      const { authUrl } = await resp.json();
      if (!authUrl) throw new Error("No auth URL from backend");

      chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert("Auth failed: " + chrome.runtime.lastError.message);
          return;
        }
        // redirectUrl contains code (or access token), send it to backend to exchange
        const res = await fetch(`${base}/auth/${provider}/finish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ redirectUrl })
        });
        const json = await res.json();
        if (res.ok && json.sessionToken) {
          chrome.storage.sync.set({ sessionToken: json.sessionToken, backendUrl: base }, () => {
            setSessionToken(json.sessionToken);
            checkConnections(base, json.sessionToken);
            alert(`${provider} connected`);
          });
        } else {
          console.error(json);
          alert("Auth exchange failed");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Auth error: " + err.message);
    }
  }

  return (
    <div className="w-80 p-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Research Collector</h2>

      <label className="block mb-2">
        <span className="text-xs text-gray-600">Backend URL</span>
        <input
          className="w-full p-2 border rounded"
          value={backendUrl}
          onChange={(e) => {
            const v = e.target.value;
            setBackendUrl(v);
            if (typeof chrome !== "undefined" && chrome.storage) chrome.storage.sync.set({ backendUrl: v });
          }}
        />
      </label>

      <div className="space-y-2 mt-3">
        <button className="w-full p-2 bg-red-500 text-white rounded" onClick={() => startAuth("notion")}>
          {connected.notion ? "Notion: Connected ✅" : "Connect Notion"}
        </button>
        <button className="w-full p-2 bg-green-600 text-white rounded" onClick={() => startAuth("google")}>
          {connected.google ? "Google: Connected ✅" : "Connect Google"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">After connecting, right-click selected text → Save to Notion / Google Drive</p>
    </div>
  );
}
