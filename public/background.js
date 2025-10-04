/* global chrome */

// background service worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "saveToNotion",
      title: "Save to Notion",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      id: "saveToDrive",
      title: "Save to Google Drive",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText) return;

  const payload = {
    text: info.selectionText,
    meta: {
      title: tab?.title || "",
      url: info.pageUrl || "",
      timestamp: new Date().toISOString()
    }
  };

  // get backend base url and session token
  chrome.storage.sync.get(["backendUrl", "sessionToken"], async (res) => {
    const backendUrl = res.backendUrl || "http://localhost:4000";
    const headers = { "Content-Type": "application/json" };
    if (res.sessionToken) headers["Authorization"] = `Bearer ${res.sessionToken}`;

    try {
      if (info.menuItemId === "saveToNotion") {
        const r = await fetch(`${backendUrl}/api/save/notion`, { method: "POST", headers, body: JSON.stringify(payload) });
        const j = await r.json();
        notify(r.ok ? "Saved to Notion" : "Notion save failed", j.message || (j.error && j.error.message) || "");
      } else if (info.menuItemId === "saveToDrive") {
        const r = await fetch(`${backendUrl}/api/save/drive`, { method: "POST", headers, body: JSON.stringify(payload) });
        const j = await r.json();
        notify(r.ok ? "Saved to Google Drive" : "Drive save failed", j.message || (j.error && j.error.message) || "");
      }
    } catch (err) {
      console.error("Save error", err);
      notify("Save failed", err.message || "");
    }
  });
});

function notify(title, message) {
  if (chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title,
      message: message || ""
    });
  } else {
    console.log(title, message);
  }
}
