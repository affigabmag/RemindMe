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

function createPopup() {
  if (document.getElementById('discounts-popup-container')) {
    return;
  }

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('popup.css');
  document.head.appendChild(styleLink);

  // Get messages for current site category
  const category = getSiteCategory(window.location.hostname);
  const messages = category ? getMessagesByCategory(category) : [];

  // Build message links HTML
  let messagesHTML = '';
  messages.forEach((msg, index) => {
    const isClickable = msg.clickable !== false; // Default to clickable
    if (isClickable && msg.url !== '#') {
      messagesHTML += `
        <a href="${msg.url}" target="_blank" class="discounts-popup-link" data-incognito="${msg.incognito}" data-index="${index}">
          <span>${msg.icon} ${msg.label}</span>
        </a>
      `;
    } else {
      messagesHTML += `
        <div class="discounts-popup-link discounts-popup-text">
          <span>${msg.icon} ${msg.label}</span>
        </div>
      `;
    }
  });

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

function togglePopup() {
  if (popupVisible) {
    hidePopup();
  } else {
    showPopup();
  }
}

if (getSiteCategory(window.location.hostname)) {
  createPopup();
  showPopup();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePopup') {
    togglePopup();
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

function showSettingsModal() {
  const existing = document.getElementById('settings-modal-overlay');
  if (existing) {
    existing.remove();
  }

  // Load reminders first
  chrome.storage.local.get(['reminders'], (result) => {
    const reminders = result.reminders || [];

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'settings-modal-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5); z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.style.cssText = `
      background: rgba(45, 52, 54, 0.95); border-radius: 8px;
      padding: 0; max-width: 1000px; width: 90%; max-height: 90vh;
      overflow: auto; border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      direction: ${isRTL() ? 'rtl' : 'ltr'};
    `;

    modal.innerHTML = getSettingsHTML(reminders);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Setup event listeners
    setupSettingsModal(modal);

    // Close on background click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
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
    const reminderCell = `<td>${escapeHtml(item.reminder)}</td>`;
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
      #settings-modal * { box-sizing: border-box; }
      #settings-modal { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .settings-header { background: rgba(0, 0, 0, 0.4); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); color: #fff; }
      .settings-header h1 { margin: 0; font-size: 24px; }
      .settings-close { background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; padding: 0; width: 32px; height: 32px; }
      .settings-content { padding: 20px; color: #fff; }
      .settings-table { width: 100%; border-collapse: collapse; background: rgba(45, 52, 54, 0.3); }
      .settings-table thead { background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255,255,255,0.15); }
      .settings-table th { padding: 12px 16px; text-align: ${rtl ? 'right' : 'left'}; font-weight: 600; color: #fff; font-size: 14px; }
      .settings-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 14px; text-align: ${rtl ? 'right' : 'left'}; }
      .settings-table tbody tr:hover { background: rgba(255,255,255,0.05); }
      .settings-actions { margin-top: 20px; display: flex; gap: 10px; justify-content: ${rtl ? 'flex-start' : 'flex-start'}; flex-direction: ${rtl ? 'row-reverse' : 'row'}; }
      .icon-btn { background: none; border: none; font-size: 18px; cursor: pointer; padding: 6px 8px; border-radius: 4px; transition: all 0.2s; color: white; font-weight: bold; }
      .icon-btn:hover { transform: scale(1.2); opacity: 0.8; }
      .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
      .btn-add { background: #28a745; color: white; font-size: 16px; }
      .btn-add:hover { background: #218838; }
      .btn-save { background: #007bff; color: white; font-size: 16px; }
      .btn-save:hover { background: #0056b3; }
    </style>
    <div class="settings-header">
      <h1>⚙️ ${getLabel('settings')}</h1>
      <button class="settings-close" data-close>✕</button>
    </div>
    <div class="settings-content">
      <table class="settings-table">
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="settings-actions">
        <button class="btn btn-add" data-action="add">➕ ${getLabel('add')}</button>
        <button class="btn btn-save" data-action="save">💾 ${getLabel('save')}</button>
      </div>
    </div>
  `;
}

function setupSettingsModal(modal) {
  // Close button
  modal.querySelector('[data-close]').addEventListener('click', () => {
    document.getElementById('settings-modal-overlay').remove();
  });

  // Add button
  modal.querySelector('[data-action="add"]').addEventListener('click', () => {
    showReminderDialog(null);
  });

  // Save button
  modal.querySelector('[data-action="save"]').addEventListener('click', () => {
    showConfirmDialog(getLabel('saved'));
  });

  // Event delegation for edit/delete on table rows
  const tableBody = modal.querySelector('tbody');
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
      <textarea class="dialog-input" id="dialog-reminder" placeholder="${rtl ? 'למשל, השתמש ב-Cashback.co.il' : 'e.g., Use Cashback.co.il'}" rows="4" style="resize: vertical;">${item ? escapeHtml(item.reminder) : ''}</textarea>
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
