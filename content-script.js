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

let popupVisible = true;

function isShoppingSite() {
  return SHOPPING_SITES.some(site => window.location.hostname.toLowerCase().includes(site));
}

function createPopup() {
  if (document.getElementById('discounts-popup-container')) {
    return;
  }

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('popup.css');
  document.head.appendChild(styleLink);

  const container = document.createElement('div');
  container.id = 'discounts-popup-container';
  container.innerHTML = `
    <div id="discounts-popup-sidebar">
      <div id="discounts-popup-header">
        <span>💰 Remember to use:</span>
        <div id="discounts-popup-controls">
          <a href="https://github.com/affigabmag/RemindMe" target="_blank" id="discounts-popup-github" title="View on GitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <button id="discounts-popup-close">✕</button>
        </div>
      </div>
      <div id="discounts-popup-content">
        <a href="http://Cashback.co.il" target="_blank" class="discounts-popup-link">
          <span>Cashback.co.il</span>
        </a>
        <a href="https://ali-buy.com/aliexpress-coupons/" target="_blank" class="discounts-popup-link">
          <span>ali-buy.com/aliexpress-coupons/</span>
        </a>
        <a href="#" class="discounts-popup-link" id="aliexpress-portals-link">
          <span>Aliexpress portals</span>
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const closeBtn = document.getElementById('discounts-popup-close');
  closeBtn.addEventListener('click', () => {
    hidePopup();
  });
}

function showPopup() {
  if (!document.getElementById('discounts-popup-container')) {
    createPopup();
  }
  const popup = document.getElementById('discounts-popup-container');
  popup.style.display = 'block';
  popupVisible = true;
}

function hidePopup() {
  const popup = document.getElementById('discounts-popup-container');
  if (popup) {
    popup.style.display = 'none';
    popupVisible = false;
  }
}

function togglePopup() {
  if (popupVisible) {
    hidePopup();
  } else {
    showPopup();
  }
}

if (isShoppingSite()) {
  createPopup();
  showPopup();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePopup') {
    togglePopup();
    sendResponse({ status: 'toggled' });
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('#aliexpress-portals-link')) {
    e.preventDefault();
    chrome.runtime.sendMessage({
      action: 'openIncognito',
      url: 'https://portals.aliexpress.com/affiportals/web/home.htm'
    });
  }
}, true);
