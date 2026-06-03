const VERSION = "01.12";

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
  'banggood.com',
  'booking.com',
  'expedia.com',
  'airbnb.com',
  'trivago.com'
];

let popupVisible = true;

function createPopup(matchingReminders = []) {
  if (document.getElementById('discounts-popup-container')) {
    return;
  }

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('popup.css');
  document.head.appendChild(styleLink);

  // Build reminder HTML from matching reminders
  let messagesHTML = '';
  if (matchingReminders && matchingReminders.length > 0) {
    matchingReminders.forEach((reminder, index) => {
      messagesHTML += `
        <div class="discounts-popup-link discounts-popup-reminder">
          <span>${reminder.reminder}</span>
        </div>
      `;
    });
  } else {
    // Empty state - show message
    messagesHTML = `
      <div class="discounts-popup-empty">
        <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 20px 0;">No reminders for this domain</p>
      </div>
    `;
  }

  const container = document.createElement('div');
  container.id = 'discounts-popup-container';
  container.innerHTML = `
    <div id="discounts-popup-sidebar">
      <div id="discounts-popup-header">
        <span id="discounts-popup-title">💰 Remember to use:</span>
        <div id="discounts-popup-controls">
          <button id="discounts-popup-settings" title="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.1-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.1.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
          <a href="https://github.com/affigabmag/RemindMe" target="_blank" id="discounts-popup-github" title="View on GitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <button id="discounts-popup-close">✕</button>
        </div>
      </div>
      <div id="discounts-popup-content">
        ${messagesHTML}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Add event listeners
  const closeBtn = document.getElementById('discounts-popup-close');
  closeBtn.addEventListener('click', () => {
    hidePopup();
  });

  const settingsBtn = document.getElementById('discounts-popup-settings');
  settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Gear icon clicked, opening settings...');
    showSettingsModal();
  });

  // Handle incognito links
  document.querySelectorAll('[data-incognito="true"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.sendMessage({
        action: 'openIncognito',
        url: link.href
      });
    });
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

function getMatchingReminders() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['reminders'], (result) => {
      const reminders = result.reminders || [];
      const currentUrl = window.location.href.toLowerCase();
      const matching = reminders.filter(reminder =>
        currentUrl.includes(reminder.domain.toLowerCase())
      );
      resolve(matching);
    });
  });
}

function togglePopup() {
  if (popupVisible) {
    hidePopup();
  } else {
    showPopup();
  }
}

function showEmptyDialog() {
  // Remove existing container
  const existing = document.getElementById('discounts-popup-container');
  if (existing) {
    existing.remove();
  }
  popupVisible = false;

  // Create empty dialog
  createPopup([]);
  showPopup();
}

// Auto popup - only show if reminders match current URL
getMatchingReminders().then(matching => {
  if (matching.length > 0) {
    createPopup(matching);
    showPopup();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePopup') {
    // Manual click - always show popup
    getMatchingReminders().then(matching => {
      if (matching.length > 0) {
        // Remove existing container and create new one with reminders
        const existing = document.getElementById('discounts-popup-container');
        if (existing) existing.remove();
        popupVisible = false;
        createPopup(matching);
        showPopup();
      } else {
        // Show empty dialog
        showEmptyDialog();
      }
    });
    sendResponse({ status: 'toggled' });
  }
});

function isRTL() {
  return document.dir === 'rtl' || document.documentElement.lang?.startsWith('he') || document.documentElement.lang?.startsWith('ar');
}

function getLabel(key) {
  const rtl = isRTL();
  const labels = {
    en: {
      settings: 'RemindMe Settings',
      reminder: 'Reminder',
      domain: 'Domain/URL',
      actions: 'Actions',
      add: 'Add Reminder',
      save: 'Save All',
      edit: 'Edit Reminder',
      delete: 'Delete Reminder?',
      deleteMsg: 'Are you sure you want to delete this reminder? This action cannot be undone.',
      cancel: 'Cancel',
      ok: 'OK',
      fillFields: 'Please fill in both fields',
      saved: 'Reminders saved to Chrome Storage!'
    },
    he: {
      settings: 'הגדרות RemindMe',
      reminder: 'תזכורת',
      domain: 'דומיין/URL',
      actions: 'פעולות',
      add: 'הוסף תזכורת',
      save: 'שמור הכל',
      edit: 'ערוך תזכורת',
      delete: 'מחק תזכורת?',
      deleteMsg: 'האם אתה בטוח שברצונך למחוק תזכורת זו? לא ניתן לבטל את הפעולה.',
      cancel: 'ביטול',
      ok: 'אישור',
      fillFields: 'אנא מלא את שני השדות',
      saved: 'התזכורות נשמרו!'
    }
  };
  const lang = rtl ? 'he' : 'en';
  return labels[lang][key] || labels.en[key];
}

function updatePopupDisplay() {
  getMatchingReminders().then(matching => {
    const container = document.getElementById('discounts-popup-container');

    if (matching.length > 0) {
      // Remove old popup and create new one with updated reminders
      if (container) container.remove();
      popupVisible = false;
      createPopup(matching);
      showPopup();
    } else {
      // No matching reminders - hide popup
      if (container) container.remove();
      popupVisible = false;
    }
  });
}

function showSettingsModal() {
  const existingHost = document.getElementById('settings-shadow-host');
  if (existingHost) {
    existingHost.remove();
  }

  // Load reminders first
  chrome.storage.local.get(['reminders'], (result) => {
    const reminders = result.reminders || [];

    // Create shadow host
    const shadowHost = document.createElement('div');
    shadowHost.id = 'settings-shadow-host';
    document.body.appendChild(shadowHost);

    // Attach shadow root
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Create overlay in shadow DOM
    const overlay = document.createElement('div');
    overlay.id = 'settings-modal-overlay';
    overlay.style.cssText = `
      position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      background: rgba(0, 0, 0, 0.5) !important; z-index: 2147483647 !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      margin: 0 !important; padding: 0 !important; border: none !important;
    `;

    // Create modal content in shadow DOM
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.style.cssText = `
      background: rgba(45, 52, 54, 0.95) !important; border-radius: 8px !important;
      padding: 0 !important; max-width: 1000px !important; width: 90% !important; max-height: 90vh !important;
      overflow: auto !important; border: 1px solid rgba(255,255,255,0.15) !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
      direction: ${isRTL() ? 'rtl' : 'ltr'} !important;
      margin: 0 !important; position: relative !important;
    `;

    modal.innerHTML = getSettingsHTML(reminders);
    overlay.appendChild(modal);

    // Add styles and content to shadow DOM
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      * { all: revert !important; }
      #settings-modal-overlay { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: rgba(0, 0, 0, 0.5) !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important; border: none !important; }
      #settings-modal { background: rgba(45, 52, 54, 0.95) !important; border-radius: 8px !important; padding: 0 !important; max-width: 1000px !important; width: 90% !important; max-height: 90vh !important; overflow: auto !important; border: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; }
      #csv-import-input { display: none !important; }
    `;
    shadowRoot.appendChild(styleTag);
    shadowRoot.appendChild(overlay);

    // Setup event listeners
    setupSettingsModal(modal);

    // Close on background click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        // Remove shadow host from main document
        const host = overlay.getRootNode().host;
        host.remove();
        // Update popup after settings close
        updatePopupDisplay();
      }
    });
  });
}

function getSettingsHTML(reminders) {
  const rtl = isRTL();
  const rows = reminders.map((item, index) => {
    const actionCell = `<td style="text-align: center; gap: 5px; display: flex; justify-content: center;">
      <button class="icon-btn" data-action="edit" data-index="${index}" title="Edit" style="background: #007bff;">✏️</button>
      <button class="icon-btn" data-action="delete" data-index="${index}" title="Delete" style="background: #dc3545;">🗑️</button>
    </td>`;
    const reminderCell = `<td>${item.reminder}</td>`;
    const domainCell = `<td>${escapeHtml(item.domain)}</td>`;

    // For RTL, reverse the order: Actions | Domain | Reminder
    if (rtl) {
      return `<tr>${actionCell}${domainCell}${reminderCell}</tr>`;
    } else {
      return `<tr>${reminderCell}${domainCell}${actionCell}</tr>`;
    }
  }).join('');

  const headerCells = rtl
    ? `<th>${getLabel('actions')}</th><th>${getLabel('domain')}</th><th>${getLabel('reminder')}</th>`
    : `<th>${getLabel('reminder')}</th><th>${getLabel('domain')}</th><th>${getLabel('actions')}</th>`;

  return `
    <style>
      #settings-modal * { box-sizing: border-box !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }
      #settings-modal { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; all: initial !important; }
      .settings-header { background: rgba(0, 0, 0, 0.4) !important; padding: 20px !important; display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid rgba(255,255,255,0.15) !important; color: #fff !important; }
      .settings-header h1 { margin: 0 !important; font-size: 24px !important; color: #fff !important; }
      .settings-close { background: none !important; border: none !important; color: #fff !important; font-size: 28px !important; cursor: pointer !important; padding: 0 !important; width: 32px !important; height: 32px !important; }
      .settings-content { padding: 20px !important; color: #fff !important; }
      .settings-table { width: 100% !important; border-collapse: collapse !important; background: rgba(45, 52, 54, 0.3) !important; border: none !important; border-spacing: 0 !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; outline: none !important; }
      .settings-table *, .settings-table *::before, .settings-table *::after { border: none !important; box-shadow: none !important; outline: none !important; }
      .settings-table thead { background: rgba(0, 0, 0, 0.3) !important; border-bottom: 1px solid rgba(255,255,255,0.15) !important; border: none !important; box-shadow: none !important; }
      .settings-table thead::before, .settings-table thead::after { display: none !important; }
      .settings-table th { padding: 12px 16px !important; text-align: ${rtl ? 'right' : 'left'} !important; font-weight: 600 !important; color: #fff !important; font-size: 14px !important; border: none !important; background: rgba(0, 0, 0, 0.3) !important; box-shadow: none !important; outline: none !important; }
      .settings-table th::before, .settings-table th::after { display: none !important; }
      .settings-table td { padding: 12px 16px !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; border-left: none !important; border-right: none !important; border-top: none !important; color: #fff !important; font-size: 14px !important; text-align: ${rtl ? 'right' : 'left'} !important; white-space: pre-wrap !important; word-wrap: break-word !important; line-height: 1.5 !important; background: transparent !important; box-shadow: none !important; outline: none !important; min-width: 150px !important; max-width: 500px !important; }
      .settings-table td::before, .settings-table td::after { display: none !important; }
      .settings-table tbody tr { border: none !important; box-shadow: none !important; outline: none !important; }
      .settings-table tbody tr::before, .settings-table tbody tr::after { display: none !important; }
      .settings-table a { color: #00bfff !important; text-decoration: underline !important; cursor: pointer !important; }
      .settings-table a:hover { color: #00d4ff !important; text-decoration: underline !important; }
      .settings-table b { font-weight: bold !important; color: #fff !important; }
      .settings-table tbody tr:hover { background: rgba(255,255,255,0.05) !important; }
      .settings-actions { margin-top: 20px !important; display: flex !important; gap: 10px !important; justify-content: ${rtl ? 'flex-start' : 'flex-start'} !important; flex-direction: ${rtl ? 'row-reverse' : 'row'} !important; }
      .icon-btn { background: none !important; border: none !important; font-size: 18px !important; cursor: pointer !important; padding: 6px 8px !important; border-radius: 4px !important; transition: all 0.2s !important; color: white !important; font-weight: bold !important; }
      .icon-btn:hover { transform: scale(1.2) !important; opacity: 0.8 !important; }
      .btn { padding: 10px 20px !important; border: none !important; border-radius: 4px !important; cursor: pointer !important; font-size: 14px !important; font-weight: 600 !important; transition: all 0.2s !important; }
      .btn-add { background: #28a745 !important; color: white !important; font-size: 16px !important; }
      .btn-add:hover { background: #218838 !important; }
      .btn-save { background: #007bff !important; color: white !important; font-size: 16px !important; }
      .btn-save:hover { background: #0056b3 !important; }
      .btn-export { background: #17a2b8 !important; color: white !important; font-size: 16px !important; }
      .btn-export:hover { background: #138496 !important; }
      .btn-import { background: #6f42c1 !important; color: white !important; font-size: 16px !important; }
      .btn-import:hover { background: #5a32a3 !important; }
      .direction-toggle { background: rgba(255,255,255,0.1) !important; color: white !important; border: 1px solid rgba(255,255,255,0.2) !important; padding: 6px 12px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: 600 !important; transition: all 0.2s !important; }
      .direction-toggle:hover { background: rgba(255,255,255,0.2) !important; border-color: rgba(255,255,255,0.4) !important; transform: scale(1.1) !important; }
    </style>
    <div class="settings-header">
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <h1>⚙️ ${getLabel('settings')}</h1>
        <span style="font-size: 7px; color: rgba(255,255,255,0.35); font-weight: 300; letter-spacing: 0.5px;">v${VERSION}</span>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="direction-toggle" id="header-save" data-action="save" title="Save all changes" style="background: #007bff; border-color: #0056b3;">💾 ${getLabel('save')}</button>
        <button class="direction-toggle" id="header-add" data-action="add" title="Add new reminder" style="background: #28a745; border-color: #218838;">➕ ${getLabel('add')}</button>
        <button class="direction-toggle" id="header-export" data-action="export" title="Export to CSV" style="background: #17a2b8; border-color: #138496;">📥 Export</button>
        <button class="direction-toggle" id="header-import" data-action="import" title="Import from CSV" style="background: #6f42c1; border-color: #5a32a3;">📤 Import</button>
        <button class="direction-toggle" id="toggle-ltr" data-dir="ltr" title="English (LTR)" style="opacity: ${rtl ? '0.5' : '1'}; background: ${rtl ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.3)'};">LTR</button>
        <button class="direction-toggle" id="toggle-rtl" data-dir="rtl" title="עברית (RTL)" style="opacity: ${rtl ? '1' : '0.5'}; background: ${rtl ? 'rgba(0,123,255,0.3)' : 'rgba(255,255,255,0.1)'};">RTL</button>
        <button class="settings-close" data-close>✕</button>
      </div>
    </div>
    <div class="settings-content">
      <table class="settings-table">
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <input type="file" id="csv-import-input" accept=".csv" style="display: none;">
    </div>
  `;
}

function setupSettingsModal(modal) {
  // Close button
  const closeBtn = modal.querySelector('[data-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Remove shadow host from main document
      const host = modal.getRootNode().host;
      host.remove();
      // Refresh popup after closing settings
      updatePopupDisplay();
    });
  }

  // Header buttons
  const headerAddBtn = modal.querySelector('#header-add');
  const headerSaveBtn = modal.querySelector('#header-save');
  const headerExportBtn = modal.querySelector('#header-export');
  const headerImportBtn = modal.querySelector('#header-import');

  if (headerAddBtn) {
    headerAddBtn.addEventListener('click', () => {
      showReminderDialog(null);
    });
  }

  if (headerSaveBtn) {
    headerSaveBtn.addEventListener('click', () => {
      showConfirmDialog(getLabel('saved'));
      setTimeout(() => {
        updatePopupDisplay();
      }, 500);
    });
  }

  if (headerExportBtn) {
    headerExportBtn.addEventListener('click', () => {
      exportToCSV();
    });
  }

  if (headerImportBtn) {
    headerImportBtn.addEventListener('click', () => {
      // Find file input in shadow DOM via modal
      const fileInput = modal.querySelector('#csv-import-input');
      if (fileInput) {
        fileInput.click();
      }
    });
  }

  // LTR/RTL toggle buttons
  const ltrBtn = modal.querySelector('#toggle-ltr');
  const rtlBtn = modal.querySelector('#toggle-rtl');

  if (ltrBtn) {
    ltrBtn.addEventListener('click', () => {
      document.documentElement.lang = 'en';
      document.dir = 'ltr';
      // Refresh modal to update RTL state
      const overlay = document.getElementById('settings-modal-overlay');
      if (overlay) overlay.remove();
      showSettingsModal();
    });
  }

  if (rtlBtn) {
    rtlBtn.addEventListener('click', () => {
      document.documentElement.lang = 'he';
      document.dir = 'rtl';
      // Refresh modal to update RTL state
      const overlay = document.getElementById('settings-modal-overlay');
      if (overlay) overlay.remove();
      showSettingsModal();
    });
  }

  // Handle CSV file import
  const fileInput = modal.querySelector('#csv-import-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importFromCSV(e.target.files[0]);
      }
    });
  }

  // Event delegation for edit/delete on table rows
  const tableBody = modal.querySelector('tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const index = parseInt(btn.dataset.index);
      const action = btn.dataset.action;

      if (action === 'edit') {
        chrome.storage.local.get(['reminders'], (r) => {
          const reminders = r.reminders || [];
          const item = reminders[index];
          showReminderDialog(index, item);
        });
      } else if (action === 'delete') {
        showDeleteConfirmDialog(index);
      }
    });
  }
}

function showReminderDialog(index, item) {
  const rtl = isRTL();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 2147483648;
    display: flex; align-items: center; justify-content: center;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(45, 52, 54, 0.95); border-radius: 8px;
    padding: 30px; max-width: 500px; width: 90%;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    direction: ${rtl ? 'rtl' : 'ltr'};
  `;

  const titleText = index !== null ? `✏️ ${getLabel('edit')}` : `➕ ${getLabel('add')}`;

  dialog.innerHTML = `
    <style>
      .dialog-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #fff; }
      .dialog-form-group { margin-bottom: 15px; }
      .dialog-label { display: block; margin-bottom: 5px; font-weight: 500; color: #fff; font-size: 14px; text-align: ${rtl ? 'right' : 'left'}; }
      .dialog-toolbar { display: flex; gap: 5px; margin-bottom: 8px; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .toolbar-btn { padding: 6px 10px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; border-radius: 3px; font-weight: 600; font-size: 12px; }
      .toolbar-btn:hover { background: rgba(255,255,255,0.2); border-color: #007bff; }
      .dialog-input { width: 100%; padding: 10px; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; background: rgba(255,255,255,0.15); color: #ffffff; font-size: 14px; font-family: inherit; text-align: ${rtl ? 'right' : 'left'}; box-sizing: border-box; }
      .dialog-input::placeholder { color: rgba(255,255,255,0.5); }
      .dialog-input:focus { outline: none; border-color: #007bff; background: rgba(255,255,255,0.15); color: #ffffff; text-shadow: 0 0 4px rgba(0,123,255,0.5); box-shadow: 0 0 0 3px rgba(0,123,255,0.25); border-width: 2px; }
      textarea.dialog-input { resize: vertical; min-height: 80px; line-height: 1.4; }
      .dialog-buttons { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .dialog-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
      .dialog-btn-cancel { background: #6c757d; color: white; }
      .dialog-btn-cancel:hover { background: #5a6268; }
      .dialog-btn-ok { background: #007bff; color: white; }
      .dialog-btn-ok:hover { background: #0056b3; }
    </style>
    <div class="dialog-title">${titleText}</div>
    <div class="dialog-form-group">
      <label class="dialog-label">${rtl ? 'טקסט תזכורת' : 'Reminder Text'}</label>
      <div class="dialog-toolbar">
        <button class="toolbar-btn" id="format-bold" type="button" title="Bold (select text first)"><b>B</b></button>
        <button class="toolbar-btn" id="format-link" type="button" title="Link (select text first)">🔗</button>
        <button class="toolbar-btn" id="format-preview" type="button" title="Preview as HTML">👁️</button>
      </div>
      <textarea class="dialog-input" id="dialog-reminder" placeholder="${rtl ? 'למשל, השתמש ב-Cashback.co.il' : 'e.g., Use Cashback.co.il'}" rows="4" style="resize: vertical;">${item ? item.reminder : ''}</textarea>
    </div>
    <div class="dialog-form-group">
      <label class="dialog-label">${rtl ? 'דומיין/URL' : 'Domain/URL'}</label>
      <input type="text" class="dialog-input" id="dialog-domain" placeholder="${rtl ? 'למשל, amazon.com' : 'e.g., amazon.com'}" value="${item ? escapeHtml(item.domain) : ''}">
    </div>
    <div class="dialog-buttons">
      <button class="dialog-btn dialog-btn-cancel" id="dialog-cancel">${getLabel('cancel')}</button>
      <button class="dialog-btn dialog-btn-ok" id="dialog-ok">${getLabel('ok')}</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const reminderInput = dialog.querySelector('#dialog-reminder');
  reminderInput.focus();

  // Format buttons
  dialog.querySelector('#format-bold').addEventListener('click', (e) => {
    e.preventDefault();
    wrapSelectedText(reminderInput, '<b>', '</b>');
  });

  dialog.querySelector('#format-link').addEventListener('click', (e) => {
    e.preventDefault();
    showURLDialog((url) => {
      wrapSelectedText(reminderInput, `<a href="${url}">`, '</a>');
    });
  });

  dialog.querySelector('#format-preview').addEventListener('click', (e) => {
    e.preventDefault();
    showHTMLPreviewDialog(reminderInput.value);
  });

  dialog.querySelector('#dialog-cancel').addEventListener('click', () => {
    overlay.remove();
  });

  dialog.querySelector('#dialog-ok').addEventListener('click', () => {
    const reminder = reminderInput.value.trim();
    const domain = dialog.querySelector('#dialog-domain').value.trim();

    if (!reminder || !domain) {
      showConfirmDialog(getLabel('fillFields'));
      return;
    }

    chrome.storage.local.get(['reminders'], (result) => {
      let reminders = result.reminders || [];
      if (index !== null) {
        reminders[index] = { reminder, domain };
      } else {
        reminders.push({ reminder, domain });
      }
      chrome.storage.local.set({ reminders }, () => {
        overlay.remove();
        showSettingsModal();
      });
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function showDeleteConfirmDialog(index) {
  const rtl = isRTL();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 2147483648;
    display: flex; align-items: center; justify-content: center;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(45, 52, 54, 0.95); border-radius: 8px;
    padding: 30px; max-width: 400px; width: 90%;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    direction: ${rtl ? 'rtl' : 'ltr'};
  `;

  dialog.innerHTML = `
    <style>
      .dialog-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #fff; }
      .dialog-message { color: rgba(255,255,255,0.9); margin-bottom: 20px; font-size: 14px; text-align: ${rtl ? 'right' : 'left'}; }
      .dialog-buttons { display: flex; gap: 10px; justify-content: flex-end; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .dialog-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
      .dialog-btn-cancel { background: #6c757d; color: white; }
      .dialog-btn-cancel:hover { background: #5a6268; }
      .dialog-btn-delete { background: #dc3545; color: white; }
      .dialog-btn-delete:hover { background: #c82333; }
    </style>
    <div class="dialog-title">🗑️ ${getLabel('delete')}</div>
    <div class="dialog-message">${getLabel('deleteMsg')}</div>
    <div class="dialog-buttons">
      <button class="dialog-btn dialog-btn-cancel" id="dialog-cancel">${getLabel('cancel')}</button>
      <button class="dialog-btn dialog-btn-delete" id="dialog-delete">🗑️ ${getLabel('delete')}</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  dialog.querySelector('#dialog-cancel').addEventListener('click', () => {
    overlay.remove();
  });

  dialog.querySelector('#dialog-delete').addEventListener('click', () => {
    chrome.storage.local.get(['reminders'], (r) => {
      const reminders = r.reminders || [];
      reminders.splice(index, 1);
      chrome.storage.local.set({ reminders }, () => {
        overlay.remove();
        showSettingsModal();
      });
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function showConfirmDialog(message) {
  const rtl = isRTL();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 2147483648;
    display: flex; align-items: center; justify-content: center;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(45, 52, 54, 0.95); border-radius: 8px;
    padding: 30px; max-width: 400px; width: 90%;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    direction: ${rtl ? 'rtl' : 'ltr'};
  `;

  dialog.innerHTML = `
    <style>
      .dialog-message { color: rgba(255,255,255,0.9); margin-bottom: 20px; font-size: 16px; text-align: center; }
      .dialog-buttons { display: flex; gap: 10px; justify-content: center; }
      .dialog-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
      .dialog-btn-ok { background: #007bff; color: white; }
      .dialog-btn-ok:hover { background: #0056b3; }
    </style>
    <div class="dialog-message">${message}</div>
    <div class="dialog-buttons">
      <button class="dialog-btn dialog-btn-ok" id="dialog-ok">${getLabel('ok')}</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  dialog.querySelector('#dialog-ok').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function escapeCSVField(field) {
  if (!field) return '""';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function exportToCSV() {
  chrome.storage.local.get(['reminders'], (result) => {
    const reminders = result.reminders || [];
    if (reminders.length === 0) {
      showConfirmDialog('No reminders to export');
      return;
    }

    // Create CSV content with proper escaping
    const headers = ['Reminder', 'Domain/URL'];
    const headerRow = headers.map(h => escapeCSVField(h)).join(',');
    const rows = reminders.map(item => {
      return [escapeCSVField(item.reminder), escapeCSVField(item.domain)].join(',');
    });

    const csv = [headerRow, ...rows].join('\r\n');

    // Log for debugging
    console.log('📊 CSV EXPORT DEBUG:');
    console.log('Total reminders:', reminders.length);
    console.log('CSV content:');
    console.log(csv);
    console.log('---');

    // Create blob with UTF-8 BOM for proper encoding (fixes garbled text in Excel)
    const bom = '﻿';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = getTimestamp();
    a.download = `${timestamp}.reminders.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showConfirmDialog(`✅ Exported ${reminders.length} reminders. Check console for CSV content.`);
  });
}

function importFromCSV(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csv = e.target.result;

      // Proper RFC 4180 CSV parser that handles multi-line quoted fields
      const parseCSV = (text) => {
        const rows = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Escaped quote: "" becomes "
              current += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote mode
              inQuotes = !inQuotes;
            }
          } else if (char === '\n' && !inQuotes) {
            // End of row
            rows.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }

        if (current.trim()) {
          rows.push(current.trim());
        }

        return rows;
      };

      const parseRow = (row) => {
        const fields = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          const nextChar = row[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }

        fields.push(current.trim());
        return fields.map(f => f.replace(/^"|"$/g, ''));
      };

      const lines = parseCSV(csv);

      if (lines.length < 2) {
        showConfirmDialog('Invalid CSV format');
        return;
      }

      // Skip header and parse rows
      const reminders = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseRow(lines[i]);
        if (fields.length >= 2) {
          const reminder = fields[0];
          const domain = fields[1];

          if (reminder && domain) {
            reminders.push({ reminder, domain });
          }
        }
      }

      if (reminders.length === 0) {
        showConfirmDialog('No valid reminders found in file');
        return;
      }

      // Ask user if they want to replace or merge
      const confirmMsg = `Import ${reminders.length} reminders?\n\nReplace existing or merge?`;
      chrome.storage.local.get(['reminders'], (result) => {
        const existingCount = (result.reminders || []).length;
        const mergeMsg = existingCount > 0
          ? `Found ${existingCount} existing. Import will replace them.`
          : '';

        chrome.storage.local.set({ reminders }, () => {
          showConfirmDialog(`✅ Imported ${reminders.length} reminders`);
          showSettingsModal();
        });
      });
    } catch (error) {
      showConfirmDialog('Error parsing CSV file');
      console.error('CSV import error:', error);
    }
  };
  reader.readAsText(file);
}

function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day}.${hours}.${minutes}.${seconds}`;
}

function showURLDialog(callback) {
  const rtl = isRTL();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 2147483648;
    display: flex; align-items: center; justify-content: center;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(45, 52, 54, 0.95); border-radius: 8px;
    padding: 30px; max-width: 400px; width: 90%;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    direction: ${rtl ? 'rtl' : 'ltr'};
  `;

  dialog.innerHTML = `
    <style>
      .dialog-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #fff; }
      .dialog-form-group { margin-bottom: 15px; }
      .dialog-label { display: block; margin-bottom: 5px; font-weight: 500; color: #fff; font-size: 14px; }
      .dialog-input { width: 100%; padding: 10px; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; background: rgba(255,255,255,0.15); color: #ffffff; font-size: 14px; font-family: inherit; box-sizing: border-box; }
      .dialog-input::placeholder { color: rgba(255,255,255,0.5); }
      .dialog-input:focus { outline: none; border-color: #007bff; background: rgba(255,255,255,0.15); color: #ffffff; text-shadow: 0 0 4px rgba(0,123,255,0.5); box-shadow: 0 0 0 3px rgba(0,123,255,0.25); border-width: 2px; }
      .dialog-buttons { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .dialog-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
      .dialog-btn-cancel { background: #6c757d; color: white; }
      .dialog-btn-cancel:hover { background: #5a6268; }
      .dialog-btn-ok { background: #007bff; color: white; }
      .dialog-btn-ok:hover { background: #0056b3; }
    </style>
    <div class="dialog-title">Enter URL</div>
    <div class="dialog-form-group">
      <label class="dialog-label">URL:</label>
      <input type="text" class="dialog-input" id="url-input" placeholder="https://example.com" value="https://">
    </div>
    <div class="dialog-buttons">
      <button class="dialog-btn dialog-btn-cancel" id="url-cancel">Cancel</button>
      <button class="dialog-btn dialog-btn-ok" id="url-ok">OK</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const urlInput = dialog.querySelector('#url-input');
  urlInput.focus();
  urlInput.select();

  dialog.querySelector('#url-cancel').addEventListener('click', () => {
    overlay.remove();
  });

  dialog.querySelector('#url-ok').addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url && url !== 'https://') {
      callback(url);
    }
    overlay.remove();
  });

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      dialog.querySelector('#url-ok').click();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function showHTMLPreviewDialog(htmlContent) {
  const rtl = isRTL();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 2147483648;
    display: flex; align-items: center; justify-content: center;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(45, 52, 54, 0.95); border-radius: 8px;
    padding: 30px; max-width: 500px; width: 90%;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    direction: ${rtl ? 'rtl' : 'ltr'};
    max-height: 80vh; overflow-y: auto;
  `;

  dialog.innerHTML = `
    <style>
      .preview-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #fff; text-align: ${rtl ? 'right' : 'left'}; }
      .preview-content {
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 4px;
        color: #fff;
        line-height: 1.5;
        margin-bottom: 15px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
      }
      .preview-content a { color: #00bfff; text-decoration: underline; cursor: pointer; }
      .preview-content a:hover { color: #00d4ff; }
      .preview-content b { font-weight: bold; color: #fff; }
      .dialog-buttons { display: flex; gap: 10px; justify-content: flex-end; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .dialog-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
      .dialog-btn-ok { background: #007bff; color: white; }
      .dialog-btn-ok:hover { background: #0056b3; }
    </style>
    <div class="preview-title">👁️ HTML Preview</div>
    <div class="preview-content">${htmlContent || '<em style="color: rgba(255,255,255,0.6);">Empty preview</em>'}</div>
    <div class="dialog-buttons">
      <button class="dialog-btn dialog-btn-ok" id="preview-close">Close</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  dialog.querySelector('#preview-close').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function wrapSelectedText(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);

  if (!selected) {
    showConfirmDialog('Select text first');
    return;
  }

  const newText = text.substring(0, start) + before + selected + after + text.substring(end);
  textarea.value = newText;
  textarea.focus();
  textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#aliexpress-portals-link')) {
    e.preventDefault();
    chrome.runtime.sendMessage({
      action: 'openIncognito',
      url: 'https://portals.aliexpress.com/affiportals/web/home.htm'
    });
  }
}, true);

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener('mousedown', (e) => {
  const header = e.target.closest('#discounts-popup-header');
  if (!header) return;

  isDragging = true;
  const container = document.getElementById('discounts-popup-container');
  const rect = container.getBoundingClientRect();

  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
}, true);

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const container = document.getElementById('discounts-popup-container');
  if (!container) return;

  const newX = e.clientX - dragOffsetX;
  const newY = e.clientY - dragOffsetY;

  container.style.left = newX + 'px';
  container.style.top = newY + 'px';
  container.style.right = 'auto';
}, true);

document.addEventListener('mouseup', () => {
  isDragging = false;
}, true);
