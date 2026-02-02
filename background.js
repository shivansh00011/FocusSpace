
const DEFAULT_BLOCKED = [
    "youtube.com",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "reddit.com",
    "netflix.com"
];


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['blockedSites'], (result) => {
        if (!result.blockedSites) {
            chrome.storage.local.set({ blockedSites: DEFAULT_BLOCKED });
        }
    });
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_FOCUS') {
        const endTime = Date.now() + (request.duration * 60 * 1000);
        chrome.storage.local.set({ focusActive: true, focusEndTime: endTime });
        sendResponse({ status: 'started' });
    } else if (request.cmd === 'STOP_FOCUS') {
        chrome.storage.local.set({ focusActive: false, focusEndTime: null });
        sendResponse({ status: 'stopped' });
    }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        checkFocusMode(tabId, tab.url);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) checkFocusMode(activeInfo.tabId, tab.url);
    });
});

function checkFocusMode(tabId, url) {
    chrome.storage.local.get(['focusActive', 'focusEndTime', 'blockedSites'], (res) => {
        if (res.focusActive) {

            if (Date.now() > res.focusEndTime) {
                chrome.storage.local.set({ focusActive: false, focusEndTime: null });
                return;
            }

            const sites = res.blockedSites || [];
            const isBlocked = sites.some(site => url.toLowerCase().includes(site.toLowerCase()));
            
            if (isBlocked) {
                chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
            }
        }
    });
}