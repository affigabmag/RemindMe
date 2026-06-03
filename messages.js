// Site-to-category mapping
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

  // Travel & Booking sites
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

// Message definitions by category
const MESSAGES = {
  'shopping': [
    {
      label: 'Cashback.co.il',
      url: 'http://Cashback.co.il',
      icon: '💳',
      incognito: false
    },
    {
      label: 'ali-buy.com/aliexpress-coupons/',
      url: 'https://ali-buy.com/aliexpress-coupons/',
      icon: '🏷️',
      incognito: false
    },
    {
      label: 'Aliexpress portals',
      url: 'https://portals.aliexpress.com/affiportals/web/home.htm',
      icon: '🔐',
      incognito: true
    }
  ],

  'israeli-finance': [
    {
      label: 'זכור את הטעויות שבוצעו בקניית 100 אופציות',
      url: '#',
      icon: '⚠️',
      incognito: false,
      clickable: false
    },
    {
      label: 'לבצע קניות במשברים',
      url: '#',
      icon: '📊',
      incognito: false,
      clickable: false
    }
  ]
};

// Get category for current site
function getSiteCategory(hostname) {
  hostname = hostname.toLowerCase();

  // Check direct matches
  if (SITE_CATEGORIES[hostname]) {
    return SITE_CATEGORIES[hostname];
  }

  // Check partial matches (subdomains)
  for (const [site, category] of Object.entries(SITE_CATEGORIES)) {
    if (hostname.includes(site)) {
      return category;
    }
  }

  // Default to 'shopping' for all unknown sites
  return 'shopping';
}

// Get messages for category
function getMessagesByCategory(category) {
  return MESSAGES[category] || [];
}
