/* global chrome */
import { useEffect, useState } from "react";
import { motion } from "motion";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Popup() {
  const [notionKey, setNotionKey] = useState("");
  const [notionDb, setNotionDb] = useState("");
  const [docId, setDocId] = useState("");

  // Load saved settings
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["notionKey", "notionDb", "docId"], (res) => {
        setNotionKey(res.notionKey || "");
        setNotionDb(res.notionDb || "");
        setDocId(res.docId || "");
      });
    }
  }, []);

  // Save settings
  const saveSettings = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ notionKey, notionDb, docId }, () => {
        alert("✅ Settings saved");
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-80 p-5 bg-white text-gray-800">
      <h2 className="text-xl font-bold mb-4">Research Collector</h2>
      <InputField
        label="Notion API Key"
        value={notionKey}
        onChange={setNotionKey}
      />
      <InputField
        label="Notion DB ID"
        value={notionDb}
        onChange={setNotionDb}
      />
      <InputField label="Google Doc ID" value={docId} onChange={setDocId} />
      <Button text="Save Settings" onClick={saveSettings} />
    </motion.div>
  );
}
