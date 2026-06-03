// Default sample data
const DEFAULT_DATA = [
  { reminder: '💳 Cashback.co.il', domain: 'amazon.com' },
  { reminder: '🏷️ ali-buy.com coupon', domain: 'aliexpress.com' },
  { reminder: '🔐 Aliexpress Portals', domain: 'ebay.com' },
  { reminder: '💰 Check cashback rates', domain: 'walmart.com' },
  { reminder: '🎁 Look for promo codes', domain: 'target.com' }
];

let reminders = [];
let editingIndex = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReminders();
  setupEventListeners();
  renderTable();
});

function setupEventListeners() {
  document.getElementById('addBtn').addEventListener('click', openAddModal);
  document.getElementById('saveBtn').addEventListener('click', saveAll);
  document.getElementById('closeSettings').addEventListener('click', closeSettings);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('saveItemBtn').addEventListener('click', saveItem);

  // Event delegation for edit/delete buttons
  document.getElementById('tableBody').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    const action = btn.dataset.action;

    if (action === 'edit') {
      openEditModal(index);
    } else if (action === 'delete') {
      deleteReminder(index);
    }
  });
}

function loadReminders() {
  chrome.storage.local.get(['reminders'], (result) => {
    if (result.reminders && result.reminders.length > 0) {
      reminders = result.reminders;
    } else {
      reminders = [...DEFAULT_DATA];
      // Save defaults
      chrome.storage.local.set({ reminders });
    }
    renderTable();
  });
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  if (reminders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3"><div class="empty-state"><p>No reminders yet. Click "Add Reminder" to get started.</p></div></td></tr>';
    return;
  }

  reminders.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(item.reminder)}</td>
      <td>${escapeHtml(item.domain)}</td>
      <td class="action-cell">
        <button class="btn btn-edit" data-action="edit" data-index="${index}">Edit</button>
        <button class="btn btn-delete" data-action="delete" data-index="${index}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function openAddModal() {
  editingIndex = null;
  document.getElementById('modalTitle').textContent = 'Add Reminder';
  document.getElementById('reminderInput').value = '';
  document.getElementById('urlInput').value = '';
  document.getElementById('editModal').classList.add('active');
  document.getElementById('reminderInput').focus();
}

function openEditModal(index) {
  editingIndex = index;
  const item = reminders[index];
  document.getElementById('modalTitle').textContent = 'Edit Reminder';
  document.getElementById('reminderInput').value = item.reminder;
  document.getElementById('urlInput').value = item.domain;
  document.getElementById('editModal').classList.add('active');
  document.getElementById('reminderInput').focus();
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  editingIndex = null;
}

function saveItem() {
  const reminder = document.getElementById('reminderInput').value.trim();
  const domain = document.getElementById('urlInput').value.trim();

  if (!reminder || !domain) {
    alert('Please fill in both fields');
    return;
  }

  if (editingIndex !== null) {
    reminders[editingIndex] = { reminder, domain };
  } else {
    reminders.push({ reminder, domain });
  }

  closeModal();
  renderTable();
  saveAll();
}

function deleteReminder(index) {
  if (confirm('Delete this reminder?')) {
    reminders.splice(index, 1);
    renderTable();
    saveAll();
  }
}

function saveAll() {
  chrome.storage.local.set({ reminders }, () => {
    alert('Reminders saved!');
    console.log('Reminders saved to storage', reminders);
  });
}

function closeSettings() {
  window.close();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
