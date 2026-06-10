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
  chrome.storage.local.get(['reminders'], (result) => {
    const reminders = result.reminders || [];
    const urlLower = url.toLowerCase();

    // Check if any reminder matches current URL
    const hasMatch = reminders.some(reminder => {
      const domains = Array.isArray(reminder.domains) ? reminder.domains : (reminder.domain ? [reminder.domain] : []);
      return domains.some(domain => urlLower.includes(domain.toLowerCase()));
    });

    if (hasMatch) {
      // Green + blinking
      setBlinkingIcon(tabId, 'green');
    } else {
      // Yellow (static)
      setStaticIcon(tabId, 'yellow');
    }
  });
}

const blinkIntervals = {};

function setBlinkingIcon(tabId, color) {
  // Set green icon
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: `icons/icon-${color}-16.png`,
      48: `icons/icon-${color}-48.png`,
      128: `icons/icon-${color}-128.png`
    }
  }).catch(() => {
    // Tab closed or doesn't exist
  });

  // Add blinking badge indicator
  let badgeVisible = true;
  const blink = () => {
    if (badgeVisible) {
      chrome.action.setBadgeText({ tabId: tabId, text: '●' }).catch(() => {});
      chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: '#00ff00' }).catch(() => {});
    } else {
      chrome.action.setBadgeText({ tabId: tabId, text: '' }).catch(() => {});
    }
    badgeVisible = !badgeVisible;
  };

  // Stop previous blink if exists
  if (blinkIntervals[tabId]) {
    clearInterval(blinkIntervals[tabId]);
  }

  // Blink badge every 600ms
  blink();
  blinkIntervals[tabId] = setInterval(blink, 600);
}

function setStaticIcon(tabId, color) {
  // Stop blinking if active
  if (blinkIntervals[tabId]) {
    clearInterval(blinkIntervals[tabId]);
    delete blinkIntervals[tabId];
  }

  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: `icons/icon-${color}-16.png`,
      48: `icons/icon-${color}-48.png`,
      128: `icons/icon-${color}-128.png`
    }
  }).catch(() => {
    // Tab closed or doesn't exist
  });
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
