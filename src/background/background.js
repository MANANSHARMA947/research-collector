/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText || "";
  const meta = {
    url: info.pageUrl,
    title: tab.title,
    timestamp: new Date().toISOString()
  };

  if (info.menuItemId === "saveToNotion") {
    chrome.runtime.sendMessage({ action: "notion", text: selectedText, meta });
  }

  if (info.menuItemId === "saveToDrive") {
    chrome.runtime.sendMessage({ action: "drive", text: selectedText, meta });
  }
});
