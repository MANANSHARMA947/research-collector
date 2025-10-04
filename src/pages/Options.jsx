/* global chrome */
import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Options() {
  const [backendUrl, setBackendUrl] = useState("");

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["backendUrl"], (res) => {
        setBackendUrl(res.backendUrl || "http://localhost:4000");
      });
    }
  }, []);

  const saveSettings = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ backendUrl }, () => {
        alert("✅ Settings saved!");
      });
    }
  };

  const resetAuth = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.remove(["sessionToken"], () => {
        alert("🔑 Auth reset. Please reconnect Notion/Google.");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ⚙️ Research Collector Settings
        </h2>

        <InputField
          label="Backend URL"
          value={backendUrl}
          onChange={(v) => setBackendUrl(v)}
        />

        <div className="flex gap-3 mt-6">
          <Button onClick={saveSettings}>Save</Button>
          <Button onClick={resetAuth}>Reset Auth</Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Need help? Visit{" "}
          <a
            href="https://developers.notion.com"
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            Notion API docs
          </a>{" "}
          or{" "}
          <a
            href="https://developers.google.com/drive"
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            Google Drive API docs
          </a>
        </p>
      </div>
    </div>
  );
}
