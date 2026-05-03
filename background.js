const SHOPPING_SITES = [
  'amazon.com',
  'aliexpress.com',
  'ebay.com',
  'walmart.com',
  'target.com',
  'bestbuy.com',
  'etsy.com',
  'wish.com',
  'gearbest.com',
  'banggood.com'
];

function isShoppingSite(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return SHOPPING_SITES.some(site => hostname.includes(site));
  } catch {
    return false;
  }
}

function updateIconColor(tabId, url) {
  const isShopping = isShoppingSite(url);
  if (isShopping) {
    chrome.action.setIcon({
      tabId: tabId,
      path: {
        16: "icons/icon-green-16.png",
        48: "icons/icon-green-48.png",
        128: "icons/icon-green-128.png"
      }
    });
  } else {
    chrome.action.setIcon({
      tabId: tabId,
      path: {
        16: "icons/icon-yellow-16.png",
        48: "icons/icon-yellow-48.png",
        128: "icons/icon-yellow-128.png"
      }
    });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIconColor(tabId, tab.url);
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'togglePopup' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openIncognito') {
    chrome.windows.create({
      url: request.url,
      incognito: true
    });
    sendResponse({ status: 'opened' });
  }
});
