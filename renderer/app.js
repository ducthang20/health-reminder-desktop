// App Script
// Quản lý giao diện ứng dụng desktop

// State
let reminders = [];
let settings = {};
let editingReminderId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderReminders();
  updateTheme();
  updateMasterToggleUI();
  setupEventListeners();
  
  // Listen for settings updates from main process
  if (window.electronAPI) {
    window.electronAPI.onSettingsUpdated(handleSettingsUpdated);
  }
});

function handleSettingsUpdated(newSettings) {
  settings = { ...settings, ...newSettings };
  updateMasterToggleUI();
  updateTheme();
}

async function loadData() {
  try {
    const data = await window.electronAPI.getData();
    reminders = data.reminders || [];
    settings = data.settings || {
      enabled: true,
      darkMode: false,
      soundEnabled: true,
      soundVolume: 30,
      startWithWindows: false,
      startMinimized: false
    };
    
    // Update UI for desktop settings
    document.getElementById('startWithWindowsToggle').checked = settings.startWithWindows || false;
    document.getElementById('startMinimizedToggle').checked = settings.startMinimized || false;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

async function saveData() {
  try {
    await window.electronAPI.saveData({ reminders, settings });
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

function renderReminders() {
  const container = document.getElementById('remindersList');
  const emptyState = document.getElementById('emptyState');
  
  if (reminders.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  container.innerHTML = reminders.map(reminder => {
    const typeText = reminder.type === 'interval' 
      ? `Lặp lại mỗi ${reminder.interval} phút`
      : `Giờ cố định: ${reminder.times ? reminder.times.join(', ') : ''}`;
    
    return `
      <div class="reminder-card" data-id="${reminder.id}">
        <div class="reminder-header">
          <div class="reminder-message">
            <span>${reminder.icon || '💧'}</span> ${escapeHtml(reminder.message)}
          </div>
          <div class="reminder-actions">
            <button class="btn-action edit" data-id="${reminder.id}" title="Sửa">✏️</button>
            <button class="btn-action delete" data-id="${reminder.id}" title="Xóa">🗑️</button>
          </div>
        </div>
        <div class="reminder-meta">
          <div class="reminder-info">
            <span class="reminder-type">${typeText}</span>
            <span class="reminder-color" style="background: ${reminder.color}"></span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to action buttons
  container.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
  
  container.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    settings.darkMode = !settings.darkMode;
    updateTheme();
    saveData();
  });
  
  // Master toggle
  document.getElementById('masterToggle').addEventListener('change', async (e) => {
    settings.enabled = e.target.checked;
    updateMasterToggleUI();
    await saveData();
    window.electronAPI.updateAlarms();
  });
  
  // Dark mode toggle in settings
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    settings.darkMode = e.target.checked;
    updateTheme();
    saveData();
  });
  
  // Sound toggle
  document.getElementById('soundToggle').addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    document.getElementById('volumeControl').style.display = e.target.checked ? 'flex' : 'none';
    saveData();
  });
  
  // Volume slider
  document.getElementById('volumeSlider').addEventListener('input', (e) => {
    settings.soundVolume = parseInt(e.target.value);
    document.getElementById('volumeValue').textContent = e.target.value + '%';
    saveData();
  });
  
  // Start with Windows toggle
  document.getElementById('startWithWindowsToggle').addEventListener('change', async (e) => {
    settings.startWithWindows = e.target.checked;
    await saveData();
  });
  
  // Start minimized toggle
  document.getElementById('startMinimizedToggle').addEventListener('change', async (e) => {
    settings.startMinimized = e.target.checked;
    await saveData();
  });
  
  // Add reminder form
  document.getElementById('addReminderForm').addEventListener('submit', handleAddReminder);
  
  // Type radio buttons
  document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('intervalGroup').style.display = e.target.value === 'interval' ? 'block' : 'none';
      document.getElementById('scheduledGroup').style.display = e.target.value === 'scheduled' ? 'block' : 'none';
    });
  });
  
  // Interval presets
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const interval = btn.dataset.interval;
      document.getElementById('interval').value = interval;
    });
  });
  
  // Duration presets
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const duration = btn.dataset.duration;
      const isEdit = btn.closest('#editModal');
      if (isEdit) {
        document.getElementById('editDisplayDuration').value = duration;
      } else {
        document.getElementById('displayDuration').value = duration;
      }
    });
  });
  
  // Icon presets
  document.querySelectorAll('#tab-add .icon-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.dataset.icon;
      document.getElementById('iconInput').value = icon;
      document.querySelectorAll('#tab-add .icon-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Color presets
  document.querySelectorAll('#tab-add .color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      document.getElementById('color').value = color;
    });
  });
  
  // Add time slot
  document.getElementById('addTimeSlot').addEventListener('click', () => addTimeSlot());
  
  // Test reminder button
  document.getElementById('testReminder').addEventListener('click', async () => {
    const reminder = {
      id: 'test',
      message: document.getElementById('message').value || 'Đây là nhắc nhở test!',
      icon: document.getElementById('iconInput').value || '💧',
      color: document.getElementById('color').value || '#0ea5e9',
      displayMinutes: parseInt(document.getElementById('displayDuration').value) || 1
    };
    window.electronAPI.testReminder(reminder);
  });
  
  // Edit modal
  document.getElementById('editReminderForm').addEventListener('submit', handleSaveEdit);
  document.getElementById('closeModal').addEventListener('click', closeEditModal);
  document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
  document.querySelector('#editModal .modal-backdrop').addEventListener('click', closeEditModal);
  
  // Edit type change
  document.querySelectorAll('input[name="editType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('editIntervalGroup').style.display = e.target.value === 'interval' ? 'block' : 'none';
      document.getElementById('editScheduledGroup').style.display = e.target.value === 'scheduled' ? 'block' : 'none';
    });
  });
  
  // Edit add time slot
  document.getElementById('editAddTimeSlot').addEventListener('click', () => addEditTimeSlot());
  
  // Edit modal icon presets
  document.querySelectorAll('#editModal .icon-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.dataset.icon;
      document.getElementById('editIconInput').value = icon;
    });
  });
  
  // Edit modal color presets
  document.querySelectorAll('#editModal .color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      document.getElementById('editColor').value = color;
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Make switchTab global for onclick
window.switchTab = switchTab;

function updateTheme() {
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  document.getElementById('darkModeToggle').checked = settings.darkMode;
  
  // Update icon visibility
  document.querySelector('.icon-sun').style.display = settings.darkMode ? 'none' : 'block';
  document.querySelector('.icon-moon').style.display = settings.darkMode ? 'block' : 'none';
}

function updateMasterToggleUI() {
  const toggle = document.getElementById('masterToggle');
  const status = document.getElementById('masterStatus');
  
  toggle.checked = settings.enabled;
  status.textContent = settings.enabled ? 'Đang bật' : 'Đã tắt';
  status.style.color = settings.enabled ? 'var(--accent-secondary)' : 'var(--text-muted)';
  
  // Update sound control visibility
  document.getElementById('soundToggle').checked = settings.soundEnabled;
  document.getElementById('volumeControl').style.display = settings.soundEnabled ? 'flex' : 'none';
  document.getElementById('volumeSlider').value = settings.soundVolume || 30;
  document.getElementById('volumeValue').textContent = (settings.soundVolume || 30) + '%';
}

async function handleAddReminder(e) {
  e.preventDefault();
  
  const type = document.querySelector('input[name="type"]:checked').value;
  const times = type === 'scheduled' 
    ? Array.from(document.querySelectorAll('#timeSlots .time-input')).map(input => input.value)
    : [];
  
  const reminder = {
    id: Date.now().toString(),
    message: document.getElementById('message').value,
    icon: document.getElementById('iconInput').value || '💧',
    color: document.getElementById('color').value || '#0ea5e9',
    type,
    interval: type === 'interval' ? parseInt(document.getElementById('interval').value) : null,
    times,
    displayMinutes: parseInt(document.getElementById('displayDuration').value) || 1,
    enabled: true
  };
  
  reminders.push(reminder);
  await saveData();
  renderReminders();
  
  // Reset form
  e.target.reset();
  document.getElementById('iconInput').value = '💧';
  document.getElementById('color').value = '#0ea5e9';
  document.getElementById('displayDuration').value = '1';
  
  // Update alarms
  window.electronAPI.updateAlarms();
  
  // Switch to reminders tab
  switchTab('reminders');
  
  showToast('Đã tạo nhắc nhở mới!', 'success');
}

function handleEdit(e) {
  const btn = e.target.closest('.edit');
  const id = btn.dataset.id;
  const reminder = reminders.find(r => r.id === id);
  
  if (!reminder) return;
  
  editingReminderId = id;
  
  document.getElementById('editId').value = id;
  document.getElementById('editMessage').value = reminder.message;
  document.getElementById('editIconInput').value = reminder.icon;
  document.getElementById('editColor').value = reminder.color;
  document.getElementById('editDisplayDuration').value = reminder.displayMinutes || 1;
  
  // Set type
  document.querySelector(`input[name="editType"][value="${reminder.type}"]`).checked = true;
  document.getElementById('editIntervalGroup').style.display = reminder.type === 'interval' ? 'block' : 'none';
  document.getElementById('editScheduledGroup').style.display = reminder.type === 'scheduled' ? 'block' : 'none';
  
  if (reminder.type === 'interval') {
    document.getElementById('editInterval').value = reminder.interval;
  } else {
    const container = document.getElementById('editTimeSlots');
    container.innerHTML = '';
    reminder.times.forEach(time => addEditTimeSlot(time));
  }
  
  document.getElementById('editModal').classList.add('active');
}

async function handleSaveEdit(e) {
  e.preventDefault();
  
  const type = document.querySelector('input[name="editType"]:checked').value;
  const times = type === 'scheduled'
    ? Array.from(document.querySelectorAll('#editTimeSlots .time-input')).map(input => input.value)
    : [];
  
  const reminder = reminders.find(r => r.id === editingReminderId);
  if (reminder) {
    reminder.message = document.getElementById('editMessage').value;
    reminder.icon = document.getElementById('editIconInput').value;
    reminder.color = document.getElementById('editColor').value;
    reminder.type = type;
    reminder.interval = type === 'interval' ? parseInt(document.getElementById('editInterval').value) : null;
    reminder.times = times;
    reminder.displayMinutes = parseInt(document.getElementById('editDisplayDuration').value) || 1;
    
    await saveData();
    renderReminders();
    window.electronAPI.updateAlarms();
    closeEditModal();
    showToast('Đã lưu thay đổi!', 'success');
  }
}

async function handleDelete(e) {
  const btn = e.target.closest('.delete');
  const id = btn.dataset.id;
  
  if (confirm('Bạn có chắc muốn xóa nhắc nhở này?')) {
    reminders = reminders.filter(r => r.id !== id);
    await saveData();
    renderReminders();
    window.electronAPI.updateAlarms();
    showToast('Đã xóa nhắc nhở!', 'info');
  }
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  editingReminderId = null;
}

function addTimeSlot(time = '08:00') {
  const container = document.getElementById('timeSlots');
  const slot = document.createElement('div');
  slot.className = 'time-slot';
  slot.innerHTML = `
    <input type="time" class="time-input" value="${time}">
    <button type="button" class="btn-remove-time" title="Xóa">×</button>
  `;
  container.appendChild(slot);
  
  slot.querySelector('.btn-remove-time').addEventListener('click', () => {
    slot.remove();
  });
}

function addEditTimeSlot(time = '08:00') {
  const container = document.getElementById('editTimeSlots');
  const slot = document.createElement('div');
  slot.className = 'time-slot';
  slot.innerHTML = `
    <input type="time" class="time-input" value="${time}">
    <button type="button" class="btn-remove-time" title="Xóa">×</button>
  `;
  container.appendChild(slot);
  
  slot.querySelector('.btn-remove-time').addEventListener('click', () => {
    slot.remove();
  });
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
