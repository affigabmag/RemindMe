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
        <button id="discounts-popup-close">✕</button>
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
