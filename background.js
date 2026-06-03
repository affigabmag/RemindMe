// Same site mapping as in messages.js
const SITE_CATEGORIES = {
  // Shopping sites
  'amazon.com': 'shopping',
  'aliexpress.com': 'shopping',
  'ebay.com': 'shopping',
  'walmart.com': 'shopping',
  'target.com': 'shopping',
  'bestbuy.com': 'shopping',
  'etsy.com': 'shopping',
  'wish.com': 'shopping',
  'gearbest.com': 'shopping',
  'banggood.com': 'shopping',
  'booking.com': 'shopping',
  'expedia.com': 'shopping',
  'airbnb.com': 'shopping',
  'trivago.com': 'shopping',

  // Israeli Finance sites
  'sparkmeitav.ordernet.co.il': 'israeli-finance',
  'ordernet.co.il': 'israeli-finance',
  'online.fibi.co.il': 'israeli-finance',
  'fibi.co.il': 'israeli-finance'
};

function getSiteCategory(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    // Check direct matches
    if (SITE_CATEGORIES[hostname]) {
      return SITE_CATEGORIES[hostname];
    }

    // Check partial matches (subdomains)
    for (const [site, category] of Object.entries(SITE_CATEGORIES)) {
      if (hostname.includes(site)) {
        return SITE_CATEGORIES[site];
      }
    }

    // Default to 'shopping' for all unknown sites
    return 'shopping';
  } catch {
    return 'shopping';
  }
}

function updateIconColor(tabId, url) {
  const category = getSiteCategory(url);
  if (category) {
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
  chrome.tabs.sendMessage(tab.id, { action: 'togglePopup' }).catch(() => {
    // Content script not loaded yet
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openIncognito') {
    chrome.windows.create({
      url: request.url,
      incognito: true
    });
    sendResponse({ status: 'opened' });
  }

  if (request.action === 'openSettings') {
    // Send message to content script to open settings modal
    chrome.tabs.sendMessage(sender.tab.id, { action: 'showSettings' }).catch(() => {
      // Content script not loaded, open in new tab as fallback
      chrome.tabs.create({
        url: chrome.runtime.getURL('settings.html')
      });
    });
    sendResponse({ status: 'opened' });
  }
});
