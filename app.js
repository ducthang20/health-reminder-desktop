// app.js - Main Application Logic for Health Reminder Desktop App

// ==================== STATE ====================
let reminders = [];
let settings = {
  darkMode: false,
  soundEnabled: true,
  soundVolume: 100,
  language: 'vi',
  enabled: true
};
let currentDetailReminder = null;
let isElectron = false;
let ipcRenderer = null;

// Emoji Data
const EMOJI_DATA = {
  smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😋','😛','😜','🤪','😝','🤗','🤔','😐','😑','😶','😏','😒','🙄','😬','😌','😴','🤒','🤕','🤢','🤮','🥵','🥶','😱','😨','😰','😥','😭','😤','😡','🤬','😈','💀','💩','🤡','👻','👽','🤖'],
  people: ['👋','🤚','✋','🖖','👌','🤏','✌','🤞','🤟','🤘','🤙','👈','👉','👆','👇','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','🦾','🦵','🦶','👂','👃','🧠','👀','👅','👄','👶','🧒','👦','👧','🧑','👨','👩','🧓','👴','👵'],
  nature: ['🌿','🍀','🍁','🍂','🍃','🌺','🌻','🌹','🥀','🌷','🌼','🌸','💐','🌵','🌴','🌳','🌲','🌊','🌈','☀','🌤','⛅','☁','🌧','❄','☃','💧','🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🦆','🦅','🦉'],
  food: ['🍔','🍟','🍕','🌭','🥪','🌮','🌯','🍳','🥘','🍲','🥗','🍿','🍝','🍜','🍛','🍣','🍱','🥟','🍤','🍙','🍚','🍧','🍨','🍦','🍰','🎂','🍭','🍬','🍫','🍩','🍪','☕','🍵','🥤','🍺','🍻','🥂','🍷','🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍏','🍐','🍑','🍒','🍓'],
  activities: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🏒','⛳','🏹','🎣','🥊','🥋','🎽','🛹','🎿','🏂','🏋','🤸','🏇','🏊','🚣','🧗','🚴','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','🎯','🎳','🎮','🧩'],
  travel: ['🚗','🚕','🚙','🚌','🚓','🚑','🚒','🚐','🚚','🚜','🚲','🛵','🚨','🚃','🚄','🚅','🚂','🚆','🚇','✈','🚀','🛸','🚁','⛵','🚤','🚢','🗺','🗿','🗽','🗼','🏰','🏯','🎡','🎢','🏠','🏡','🏢','🏥','🏦','🏨','🏪','🏫','⛪'],
  objects: ['💡','🔦','📱','💻','🖥','💽','💾','💿','📀','🎥','📺','📷','📸','🔍','📔','📕','📖','📗','📘','📙','📚','📓','📝','💰','💴','💵','💶','💷','💳','✉','📧','📦','📫','✏','🖊','📌','📍','📎','🔒','🔓','🔑','🔨','🔧','💉','💊'],
  symbols: ['❤','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝','☮','✝','☪','🕉','☸','✡','☯','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛','☢','☣','📴','📳','🆚','💯','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪']
};

// Trend Colors
const TREND_COLORS = [
  '#FF6B6B','#EE5A5A','#FF8787','#FA5252','#E03131','#F06595','#E64980','#D6336C',
  '#FF922B','#FD7E14','#E8590C','#FFD43B','#FCC419','#FAB005','#F59F00',
  '#8CE99A','#69DB7C','#51CF66','#40C057','#37B24D','#20C997','#12B886',
  '#74C0FC','#4DABF7','#339AF0','#228BE6','#1C7ED6','#22B8CF','#15AABF',
  '#B197FC','#9775FA','#845EF7','#7950F2','#7048E8','#DA77F2','#CC5DE8','#BE4BDB',
  '#868E96','#495057','#343A40','#212529','#0EA5E9','#8B5CF6','#EC4899','#14B8A6','#F97316','#EAB308','#22C55E','#EF4444'
];

// Check if running in Electron
try {
  if (typeof require !== 'undefined') {
    const electron = require('electron');
    if (electron && electron.ipcRenderer) {
      ipcRenderer = electron.ipcRenderer;
      isElectron = true;
    }
  }
} catch (e) {
  console.log('Running in browser mode');
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  await loadData();
  initializeUI();
  setupEventListeners();
  updateLangToggleIcon();
  
  // Setup sound playback from main process
  if (isElectron) {
    ipcRenderer.on('play-sound', (event, volume) => {
      playNotificationSound(volume);
    });
  }
});

// ==================== DATA LOADING ====================
async function loadData() {
  if (isElectron) {
    reminders = await ipcRenderer.invoke('get-reminders') || [];
    settings = await ipcRenderer.invoke('get-settings') || settings;
  } else {
    // Browser fallback - localStorage
    const savedReminders = localStorage.getItem('reminders');
    const savedSettings = localStorage.getItem('settings');
    if (savedReminders) reminders = JSON.parse(savedReminders);
    if (savedSettings) settings = JSON.parse(savedSettings);
  }
}

async function saveReminders() {
  if (isElectron) {
    await ipcRenderer.invoke('save-reminders', reminders);
  } else {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }
}

async function saveSettings() {
  if (isElectron) {
    await ipcRenderer.invoke('save-settings', settings);
  } else {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}

// ==================== I18N HELPER ====================
function t(key) {
  return i18n.t(key);
}

function updateLangToggleIcon() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  const flagEn = btn.querySelector('.flag-en');
  const flagVi = btn.querySelector('.flag-vi');
  if (flagEn && flagVi) {
    flagEn.style.display = i18n.currentLang === 'vi' ? 'none' : 'block';
    flagVi.style.display = i18n.currentLang === 'vi' ? 'block' : 'none';
  }
}

// ==================== INITIALIZE UI ====================
function initializeUI() {
  i18n.applyTranslations();
  updateTheme();
  renderReminders();
  initSettingsUI();
}

function updateTheme() {
  document.body.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  const sunIcon = document.querySelector('.icon-sun');
  const moonIcon = document.querySelector('.icon-moon');
  if (sunIcon && moonIcon) {
    sunIcon.style.display = settings.darkMode ? 'none' : 'block';
    moonIcon.style.display = settings.darkMode ? 'block' : 'none';
  }
}

function initSettingsUI() {
  // Dark mode
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
  }
  
  // Language
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = settings.language || 'vi';
  }
  
  // Sound
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.checked = settings.soundEnabled !== false;
  }
  
  // Volume
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  if (volumeSlider && volumeValue) {
    volumeSlider.value = settings.soundVolume || 100;
    volumeValue.textContent = (settings.soundVolume || 100) + '%';
  }
  
  // Auto-start
  const autoStartToggle = document.getElementById('autoStartToggle');
  if (autoStartToggle && isElectron) {
    ipcRenderer.invoke('get-auto-start').then(enabled => {
      autoStartToggle.checked = enabled;
      settings.autoStart = enabled;
    });
  }
  
  // Master toggle
  const masterToggle = document.getElementById('masterToggle');
  const masterStatus = document.getElementById('masterStatus');
  if (masterToggle && masterStatus) {
    masterToggle.checked = settings.enabled !== false;
    masterStatus.textContent = settings.enabled !== false ? t('statusEnabled') : t('statusDisabled');
  }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  
  // Language toggle
  document.getElementById('langToggle')?.addEventListener('click', () => {
    i18n.toggleLanguage();
    settings.language = i18n.currentLang;
    saveSettings();
    updateLangToggleIcon();
  });
  
  // Language select in settings
  document.getElementById('languageSelect')?.addEventListener('change', (e) => {
    i18n.setLanguage(e.target.value);
    settings.language = e.target.value;
    saveSettings();
    updateLangToggleIcon();
  });
  
  // Master toggle
  document.getElementById('masterToggle')?.addEventListener('change', (e) => {
    settings.enabled = e.target.checked;
    document.getElementById('masterStatus').textContent = e.target.checked ? t('statusEnabled') : t('statusDisabled');
    saveSettings();
  });
  
  // Add reminder buttons
  document.getElementById('addReminderBtn')?.addEventListener('click', () => openReminderModal());
  document.getElementById('emptyAddReminder')?.addEventListener('click', () => openReminderModal());
  
  // Settings toggles
  document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
    settings.darkMode = e.target.checked;
    updateTheme();
    saveSettings();
  });
  
  document.getElementById('soundToggle')?.addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    saveSettings();
  });
  
  document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    settings.soundVolume = value;
    document.getElementById('volumeValue').textContent = value + '%';
    saveSettings();
  });
  
  // Auto-start toggle
  document.getElementById('autoStartToggle')?.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    settings.autoStart = enabled;
    if (isElectron) {
      await ipcRenderer.invoke('set-auto-start', enabled);
    }
    saveSettings();
  });
  
  // Data management
  document.getElementById('exportData')?.addEventListener('click', exportData);
  document.getElementById('importData')?.addEventListener('click', importData);
  document.getElementById('resetData')?.addEventListener('click', resetData);
  
  // Setup reminder modal
  setupReminderModal();
  setupReminderDetailModal();
  
  // Setup emoji and color pickers
  setupEmojiPicker();
  setupColorPicker();
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === 'tab-' + tabId);
  });
}

function toggleTheme() {
  settings.darkMode = !settings.darkMode;
  updateTheme();
  saveSettings();
  
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) darkModeToggle.checked = settings.darkMode;
}

// ==================== RENDER REMINDERS ====================
function renderReminders() {
  const container = document.getElementById('remindersList');
  const emptyState = document.getElementById('emptyReminders');
  
  if (!container || !emptyState) return;
  
  if (reminders.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }
  
  container.style.display = 'flex';
  emptyState.style.display = 'none';
  
  const locale = i18n.currentLang === 'vi' ? 'vi-VN' : 'en-US';
  const dayNames = locale === 'vi-VN' 
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  container.innerHTML = reminders.map(r => {
    const id = r.id;
    const color = r.color || '#0ea5e9';
    let typeIcon = '🔁';
    let typeText = '';
    let detailsHtml = '';
    
    if (r.type === 'interval') {
      typeIcon = '🔁';
      typeText = t('repeatByInterval');
      detailsHtml = `
        <div class="reminder-detail-item">
          <span class="detail-icon">⏱️</span>
          <span>${r.interval} ${t('minutes')}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">📺</span>
          <span>${r.displayMinutes || 1}m</span>
        </div>
      `;
    } else if (r.type === 'dateRange' && r.dateRangeSettings) {
      typeIcon = '📅';
      typeText = t('dateRange');
      const settings = r.dateRangeSettings;
      const fromDate = new Date(settings.fromDate);
      const toDate = new Date(settings.toDate);
      const fromStr = fromDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
      const toStr = toDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
      const daysStr = settings.selectedDays?.map(d => dayNames[d]).join(', ') || '';
      const times = settings.times || (settings.time ? [settings.time] : []);
      
      detailsHtml = `
        <div class="reminder-detail-item">
          <span class="detail-icon">📆</span>
          <span>${fromStr} → ${toStr}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">📋</span>
          <span>${daysStr}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">⏰</span>
          <span>${times.join(', ')}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">🔔</span>
          <span>${r.scheduledTimes?.length || 0}</span>
        </div>
      `;
    } else if (r.type === 'scheduled' && r.scheduledTimes?.length > 0) {
      typeIcon = '⏰';
      typeText = t('atFixedTime');
      const times = r.scheduledTimes.slice(0, 2).map(st => {
        if (st.date) {
          const d = new Date(st.date + 'T' + st.time);
          return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }) + ' ' + st.time;
        }
        return st.time;
      });
      
      detailsHtml = `
        <div class="reminder-detail-item">
          <span class="detail-icon">📅</span>
          <span>${times.join(', ')}${r.scheduledTimes.length > 2 ? '...' : ''}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">🔔</span>
          <span>${r.scheduledTimes.length}</span>
        </div>
        <div class="reminder-detail-item">
          <span class="detail-icon">📺</span>
          <span>${r.displayMinutes || 1}m</span>
        </div>
      `;
    }
    
    return `<div class="reminder-card" data-id="${id}" data-type="${r.type}">
      <div class="reminder-card-top">
        <div class="reminder-icon-wrapper">
          <div class="reminder-icon-bg" style="background: ${color}"></div>
          <span class="reminder-icon">${r.icon || '🔔'}</span>
        </div>
        <div class="reminder-main">
          <div class="reminder-message" style="color: ${color}">${escapeHtml(r.message)}</div>
          <span class="reminder-type-badge">${typeIcon} ${typeText}</span>
        </div>
      </div>
      <div class="reminder-card-bottom">
        <div class="reminder-details">
          ${detailsHtml}
        </div>
        <div class="reminder-actions">
          <button class="btn-icon-sm btn-edit btn-edit-reminder" data-id="${id}" title="${t('edit')}">✏️</button>
          <button class="btn-icon-sm btn-delete btn-delete-reminder" data-id="${id}" title="${t('delete')}">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
  
  // Attach event listeners
  container.querySelectorAll('.btn-edit-reminder').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      const reminder = reminders.find(r => r.id === id);
      if (reminder) openReminderModal(reminder);
    });
  });
  
  container.querySelectorAll('.btn-delete-reminder').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      if (!confirm(t('confirmDeleteReminder'))) return;
      reminders = reminders.filter(r => r.id !== id);
      await saveReminders();
      renderReminders();
      showToast(t('reminderDeleted'), 'success');
    });
  });
  
  // Click on card to show detail
  container.querySelectorAll('.reminder-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.reminder-actions')) return;
      const id = this.getAttribute('data-id');
      const reminder = reminders.find(r => r.id === id);
      if (reminder) showReminderDetail(reminder);
    });
  });
}

// ==================== REMINDER DETAIL MODAL ====================
function showReminderDetail(reminder) {
  const modal = document.getElementById('reminderDetailModal');
  const contentEl = document.getElementById('reminderDetailContent');
  
  if (!modal || !contentEl) return;
  
  currentDetailReminder = reminder;
  
  const locale = i18n.currentLang === 'vi' ? 'vi-VN' : 'en-US';
  const dayNames = locale === 'vi-VN' 
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  let timeInfo = '';
  if (reminder.type === 'interval') {
    timeInfo = `<div class="detail-row"><span class="detail-label">🔁 ${t('repeatEvery')}</span><span class="detail-value">${reminder.interval} ${t('minutes')}</span></div>`;
  } else if (reminder.type === 'dateRange' && reminder.dateRangeSettings) {
    const settings = reminder.dateRangeSettings;
    const fromDate = new Date(settings.fromDate).toLocaleDateString(locale);
    const toDate = new Date(settings.toDate).toLocaleDateString(locale);
    const selectedDaysText = settings.selectedDays?.map(d => dayNames[d]).join(', ') || '';
    const times = settings.times || (settings.time ? [settings.time] : []);
    const timesText = times.join(', ');
    
    timeInfo = `
      <div class="detail-row"><span class="detail-label">📅 ${t('dateRange')}</span><span class="detail-value">${fromDate} - ${toDate}</span></div>
      <div class="detail-row"><span class="detail-label">📆 ${t('weekdays')}</span><span class="detail-value">${selectedDaysText}</span></div>
      <div class="detail-row"><span class="detail-label">⏰ ${t('timeSlots')}</span><span class="detail-value">${timesText}</span></div>
      <div class="detail-row"><span class="detail-label">🔔 ${t('totalReminders')}</span><span class="detail-value">${reminder.scheduledTimes?.length || 0} ${t('reminders')}</span></div>
    `;
  } else if (reminder.scheduledTimes?.length > 0) {
    const times = reminder.scheduledTimes.slice(0, 5).map(st => {
      if (st.date) {
        const d = new Date(st.date + 'T' + st.time + ':00');
        return d.toLocaleString(locale, { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      }
      return st.time;
    });
    const moreText = reminder.scheduledTimes.length > 5 ? `<br><em>+${reminder.scheduledTimes.length - 5} more...</em>` : '';
    timeInfo = `<div class="detail-row"><span class="detail-label">⏰ ${t('reminderTimes')}</span><span class="detail-value">${times.join('<br>')}${moreText}</span></div>`;
  }
  
  contentEl.innerHTML = `
    <div class="reminder-detail-header">
      <span class="reminder-detail-icon" style="color: ${reminder.color || '#0ea5e9'}">${reminder.icon || '🔔'}</span>
      <div class="reminder-detail-message" style="color: ${reminder.color || '#0ea5e9'}">${escapeHtml(reminder.message)}</div>
    </div>
    <div class="reminder-detail-info">
      ${timeInfo}
      <div class="detail-row">
        <span class="detail-label">⏱️ ${t('displayDuration')}</span>
        <span class="detail-value">${reminder.displayMinutes || 1} ${t('minutes')}</span>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function hideReminderDetail() {
  document.getElementById('reminderDetailModal')?.classList.remove('active');
  currentDetailReminder = null;
}

function setupReminderDetailModal() {
  const modal = document.getElementById('reminderDetailModal');
  if (!modal) return;
  
  document.getElementById('closeReminderDetailModal')?.addEventListener('click', hideReminderDetail);
  document.getElementById('reminderDetailClose')?.addEventListener('click', hideReminderDetail);
  modal.querySelector('.modal-backdrop')?.addEventListener('click', hideReminderDetail);
  
  document.getElementById('reminderDetailEdit')?.addEventListener('click', () => {
    if (currentDetailReminder) {
      hideReminderDetail();
      openReminderModal(currentDetailReminder);
    }
  });
}

// ==================== REMINDER MODAL ====================
function setupReminderModal() {
  const modal = document.getElementById('reminderModal');
  const form = document.getElementById('reminderForm');
  if (!modal || !form) return;
  
  document.getElementById('closeReminderModal')?.addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.classList.remove('active'));
  
  // Type selector
  document.querySelectorAll('input[name="reminderType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('intervalGroup').style.display = e.target.value === 'interval' ? 'block' : 'none';
      document.getElementById('scheduledGroup').style.display = e.target.value === 'scheduled' ? 'block' : 'none';
      document.getElementById('dateRangeGroup').style.display = e.target.value === 'dateRange' ? 'block' : 'none';
    });
  });
  
  // Icon picker
  document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('reminderIcon').value = btn.dataset.icon;
      document.getElementById('selectedIconPreview').value = btn.dataset.icon;
    });
  });
  
  document.getElementById('selectedIconPreview')?.addEventListener('input', (e) => {
    document.getElementById('reminderIcon').value = e.target.value;
    document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(btn => {
      if (btn.dataset.icon === e.target.value) btn.classList.add('active');
    });
  });
  
  // Color picker
  document.querySelectorAll('#reminderColorPicker .color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reminderColorPicker .color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('reminderColor').value = btn.dataset.color;
      document.getElementById('selectedColorPreview').style.background = btn.dataset.color;
      document.getElementById('customColorPicker').value = btn.dataset.color;
    });
  });
  
  document.getElementById('customColorPicker')?.addEventListener('input', (e) => {
    document.getElementById('reminderColor').value = e.target.value;
    document.getElementById('selectedColorPreview').style.background = e.target.value;
    document.querySelectorAll('#reminderColorPicker .color-btn').forEach(b => b.classList.remove('active'));
  });
  
  // Interval presets
  document.querySelectorAll('#intervalPresets .preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#intervalPresets .preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('reminderInterval').value = btn.dataset.value;
    });
  });
  
  // Duration presets
  document.querySelectorAll('#durationPresets .preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#durationPresets .preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('displayDuration').value = btn.dataset.value;
    });
  });
  
  // Time slots
  document.getElementById('addTimeSlot')?.addEventListener('click', addTimeSlot);
  
  // Date range time slots
  document.getElementById('addDateRangeTime')?.addEventListener('click', addDateRangeTime);
  
  // Weekday picker
  document.getElementById('weekdayPicker')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.weekday-btn');
    if (btn) {
      e.preventDefault();
      btn.classList.toggle('active');
      updateDateRangeSummary();
    }
  });
  
  // Date range inputs
  ['dateRangeFrom', 'dateRangeTo'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateDateRangeSummary);
  });
  
  // Preview
  document.getElementById('previewReminder')?.addEventListener('click', previewCurrentReminder);
  
  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveReminder();
  });
}

function openReminderModal(reminder = null) {
  const modal = document.getElementById('reminderModal');
  const title = document.getElementById('reminderModalTitle');
  
  if (title) title.textContent = t(reminder ? 'editReminder' : 'addReminder');
  
  // Reset form
  document.getElementById('reminderId').value = reminder?.id || '';
  document.getElementById('reminderMessage').value = reminder?.message || '';
  document.getElementById('reminderIcon').value = reminder?.icon || '💧';
  document.getElementById('reminderColor').value = reminder?.color || '#0ea5e9';
  document.getElementById('reminderInterval').value = reminder?.interval || 30;
  document.getElementById('displayDuration').value = reminder?.displayMinutes || 1;
  document.getElementById('reminderImageUrl').value = reminder?.imageUrl || '';
  
  // Update previews
  const iconValue = reminder?.icon || '💧';
  const colorValue = reminder?.color || '#0ea5e9';
  document.getElementById('selectedIconPreview').value = iconValue;
  document.getElementById('selectedColorPreview').style.background = colorValue;
  document.getElementById('customColorPicker').value = colorValue;
  
  const type = reminder?.type || 'interval';
  const typeRadio = document.querySelector(`input[name="reminderType"][value="${type}"]`);
  if (typeRadio) typeRadio.checked = true;
  
  document.getElementById('intervalGroup').style.display = type === 'interval' ? 'block' : 'none';
  document.getElementById('scheduledGroup').style.display = type === 'scheduled' ? 'block' : 'none';
  document.getElementById('dateRangeGroup').style.display = type === 'dateRange' ? 'block' : 'none';
  
  renderTimeSlots(reminder?.scheduledTimes || []);
  
  // Restore dateRange settings
  if (type === 'dateRange' && reminder?.dateRangeSettings) {
    const settings = reminder.dateRangeSettings;
    document.getElementById('dateRangeFrom').value = settings.fromDate || '';
    document.getElementById('dateRangeTo').value = settings.toDate || '';
    
    const times = settings.times || (settings.time ? [settings.time] : ['09:00']);
    renderDateRangeTimes(times);
    
    document.querySelectorAll('#weekdayPicker .weekday-btn').forEach(btn => {
      const day = parseInt(btn.dataset.day);
      btn.classList.toggle('active', settings.selectedDays?.includes(day));
    });
    
    updateDateRangeSummary();
  } else {
    // Reset dateRange to defaults
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    document.getElementById('dateRangeFrom').value = today.toISOString().split('T')[0];
    document.getElementById('dateRangeTo').value = nextWeek.toISOString().split('T')[0];
    
    renderDateRangeTimes(['09:00']);
    
    document.querySelectorAll('#weekdayPicker .weekday-btn').forEach(btn => {
      const day = parseInt(btn.dataset.day);
      btn.classList.toggle('active', day >= 1 && day <= 5);
    });
    
    updateDateRangeSummary();
  }
  
  // Update active states
  document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.icon === iconValue);
  });
  
  document.querySelectorAll('#reminderColorPicker .color-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === colorValue);
  });
  
  document.querySelectorAll('#intervalPresets .preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === String(reminder?.interval || 30));
  });
  
  document.querySelectorAll('#durationPresets .preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === String(reminder?.displayMinutes || 1));
  });
  
  modal.classList.add('active');
}

function renderTimeSlots(times = []) {
  const container = document.getElementById('timeSlots');
  if (!container) return;
  container.innerHTML = '';
  if (times.length === 0) { addTimeSlot(); return; }
  times.forEach((item, i) => {
    container.insertAdjacentHTML('beforeend', createTimeSlotHTML(item.date || '', item.time || '09:00', i));
  });
}

function addTimeSlot() {
  const container = document.getElementById('timeSlots');
  if (!container) return;
  const today = new Date().toISOString().split('T')[0];
  container.insertAdjacentHTML('beforeend', createTimeSlotHTML(today, '09:00', container.children.length));
}

function createTimeSlotHTML(date, time, index) {
  const today = new Date().toISOString().split('T')[0];
  return `<div class="time-slot" data-index="${index}">
    <input type="date" class="slot-date" value="${date || today}">
    <input type="time" class="slot-time" value="${time || '09:00'}">
    <button type="button" class="btn-remove-slot">×</button>
  </div>`;
}

// Remove time slot handler
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-remove-slot')) {
    e.preventDefault();
    e.stopPropagation();
    const slot = e.target.closest('.time-slot');
    if (slot) slot.remove();
  }
  
  if (e.target.classList.contains('remove-time')) {
    e.preventDefault();
    e.stopPropagation();
    const item = e.target.closest('.date-range-time-item');
    if (item) {
      item.remove();
      updateDateRangeSummary();
    }
  }
});

// Date Range Time Functions
function renderDateRangeTimes(times = ['09:00']) {
  const container = document.getElementById('dateRangeTimesList');
  if (!container) return;
  
  container.innerHTML = times.map(time => `
    <div class="date-range-time-item" data-time="${time}">
      <span>${time}</span>
      <span class="remove-time">×</span>
    </div>
  `).join('');
}

function addDateRangeTime() {
  const input = document.getElementById('dateRangeTimeInput');
  const container = document.getElementById('dateRangeTimesList');
  if (!input || !container) return;
  
  const time = input.value;
  if (!time) return;
  
  // Check if already exists
  const existing = container.querySelector(`[data-time="${time}"]`);
  if (existing) return;
  
  container.insertAdjacentHTML('beforeend', `
    <div class="date-range-time-item" data-time="${time}">
      <span>${time}</span>
      <span class="remove-time">×</span>
    </div>
  `);
  
  updateDateRangeSummary();
}

function updateDateRangeSummary() {
  const fromDate = document.getElementById('dateRangeFrom')?.value;
  const toDate = document.getElementById('dateRangeTo')?.value;
  const summaryEl = document.getElementById('dateRangeSummary');
  
  if (!summaryEl) return;
  
  if (!fromDate || !toDate) {
    summaryEl.innerHTML = `<em>${t('selectDateRange')}</em>`;
    return;
  }
  
  // Get selected days
  const selectedDays = [];
  document.querySelectorAll('#weekdayPicker .weekday-btn.active').forEach(btn => {
    selectedDays.push(parseInt(btn.dataset.day));
  });
  
  // Get times
  const times = [];
  document.querySelectorAll('#dateRangeTimesList .date-range-time-item').forEach(item => {
    times.push(item.dataset.time);
  });
  
  // Calculate total reminders
  const start = new Date(fromDate);
  const end = new Date(toDate);
  let count = 0;
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (selectedDays.includes(d.getDay())) {
      count += times.length;
    }
  }
  
  const locale = i18n.currentLang === 'vi' ? 'vi-VN' : 'en-US';
  const dayNames = locale === 'vi-VN' 
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  summaryEl.innerHTML = `
    📅 ${new Date(fromDate).toLocaleDateString(locale)} → ${new Date(toDate).toLocaleDateString(locale)}<br>
    📆 ${selectedDays.map(d => dayNames[d]).join(', ')}<br>
    ⏰ ${times.join(', ')}<br>
    🔔 <strong>${count}</strong> ${t('reminders')}
  `;
}

function previewCurrentReminder() {
  const message = document.getElementById('reminderMessage').value;
  if (!message) {
    showToast(t('enterMessage'), 'error');
    return;
  }
  
  const reminder = {
    message,
    icon: document.getElementById('reminderIcon').value,
    color: document.getElementById('reminderColor').value,
    imageUrl: document.getElementById('reminderImageUrl').value.trim() || '',
    displayMinutes: parseInt(document.getElementById('displayDuration').value) || 1
  };
  
  if (isElectron) {
    ipcRenderer.send('preview-reminder', reminder);
  } else {
    // Browser fallback - show alert
    alert(`${reminder.icon} ${reminder.message}`);
  }
  
  showToast(t('previewSent'), 'success');
}

async function saveReminder() {
  const id = document.getElementById('reminderId').value;
  const type = document.querySelector('input[name="reminderType"]:checked').value;
  const message = document.getElementById('reminderMessage').value.trim();
  
  if (!message) {
    showToast(t('enterMessage'), 'error');
    return;
  }
  
  // Validate imageUrl
  const imageUrl = document.getElementById('reminderImageUrl').value.trim();
  if (imageUrl) {
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const urlLower = imageUrl.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => urlLower.includes(ext));
    if (!hasValidExtension) {
      showToast(t('invalidImageUrl'), 'error');
      return;
    }
  }
  
  let scheduledTimes = [];
  let dateRangeSettings = null;
  
  if (type === 'scheduled') {
    document.querySelectorAll('.time-slot').forEach(slot => {
      const date = slot.querySelector('.slot-date')?.value || '';
      const time = slot.querySelector('.slot-time').value;
      if (time) scheduledTimes.push({ date, time });
    });
    if (scheduledTimes.length === 0) {
      showToast(t('addTimeError'), 'error');
      return;
    }
  } else if (type === 'dateRange') {
    const fromDate = document.getElementById('dateRangeFrom')?.value;
    const toDate = document.getElementById('dateRangeTo')?.value;
    
    const times = [];
    document.querySelectorAll('#dateRangeTimesList .date-range-time-item').forEach(item => {
      times.push(item.dataset.time);
    });
    
    if (!fromDate || !toDate) {
      showToast(t('selectDateRange'), 'error');
      return;
    }
    
    if (times.length === 0) {
      showToast(t('addTimeError'), 'error');
      return;
    }
    
    const selectedDays = [];
    document.querySelectorAll('#weekdayPicker .weekday-btn.active').forEach(btn => {
      selectedDays.push(parseInt(btn.dataset.day));
    });
    
    if (selectedDays.length === 0) {
      showToast(t('selectDays'), 'error');
      return;
    }
    
    dateRangeSettings = { fromDate, toDate, times, selectedDays };
    
    // Generate scheduledTimes
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (selectedDays.includes(d.getDay())) {
        const dateStr = d.toISOString().split('T')[0];
        times.forEach(time => {
          scheduledTimes.push({ date: dateStr, time });
        });
      }
    }
    
    if (scheduledTimes.length === 0) {
      showToast(t('noMatchingDates'), 'error');
      return;
    }
  }
  
  const reminderData = {
    id: id || 'reminder-' + Date.now(),
    message,
    icon: document.getElementById('reminderIcon').value,
    color: document.getElementById('reminderColor').value,
    imageUrl,
    type,
    interval: parseInt(document.getElementById('reminderInterval').value) || 30,
    scheduledTimes,
    dateRangeSettings,
    displayMinutes: parseInt(document.getElementById('displayDuration').value) || 1,
    enabled: true
  };
  
  if (id) {
    const index = reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      reminders[index] = reminderData;
    } else {
      reminders.push(reminderData);
    }
  } else {
    reminders.push(reminderData);
  }
  
  await saveReminders();
  
  document.getElementById('reminderModal').classList.remove('active');
  renderReminders();
  showToast(t('reminderSaved'), 'success');
}

// ==================== DATA MANAGEMENT ====================
function exportData() {
  const data = { reminders, settings, exportDate: new Date().toISOString() };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'health-reminder-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast(t('dataExported'), 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.reminders) reminders = data.reminders;
      if (data.settings) {
        settings = { ...settings, ...data.settings };
        updateTheme();
        initSettingsUI();
        if (data.settings.language) {
          i18n.setLanguage(data.settings.language);
          updateLangToggleIcon();
        }
      }
      
      await saveReminders();
      await saveSettings();
      renderReminders();
      
      showToast(t('dataImported'), 'success');
    } catch (err) {
      showToast('Import error: ' + err.message, 'error');
    }
  };
  
  input.click();
}

async function resetData() {
  if (!confirm(t('confirmReset'))) return;
  
  reminders = [];
  settings = {
    darkMode: false,
    soundEnabled: true,
    soundVolume: 100,
    language: 'vi',
    enabled: true
  };
  
  await saveReminders();
  await saveSettings();
  
  updateTheme();
  initSettingsUI();
  renderReminders();
  i18n.setLanguage('vi');
  updateLangToggleIcon();
  
  showToast(t('dataReset'), 'success');
}

// ==================== EMOJI PICKER ====================
function setupEmojiPicker() {
  const modal = document.getElementById('emojiPickerModal');
  if (!modal) return;
  
  document.getElementById('closeEmojiModal')?.addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.classList.remove('active'));
  
  // Category buttons
  document.querySelectorAll('.emoji-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.emoji-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEmojiGrid(btn.dataset.category);
    });
  });
  
  // More emoji button
  document.getElementById('moreEmojiBtn')?.addEventListener('click', () => {
    renderEmojiGrid('smileys');
    document.querySelectorAll('.emoji-category-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.emoji-category-btn[data-category="smileys"]')?.classList.add('active');
    modal.classList.add('active');
  });
  
  // Initial render
  renderEmojiGrid('smileys');
}

function renderEmojiGrid(category) {
  const grid = document.getElementById('emojiGrid');
  if (!grid) return;
  
  const emojis = EMOJI_DATA[category] || [];
  grid.innerHTML = emojis.map(e => `<button type="button" class="emoji-item">${e}</button>`).join('');
  
  grid.querySelectorAll('.emoji-item').forEach(btn => {
    btn.addEventListener('click', () => selectEmoji(btn.textContent));
  });
}

function selectEmoji(emoji) {
  document.getElementById('selectedIconPreview').value = emoji;
  document.getElementById('reminderIcon').value = emoji;
  
  // Update active state in presets
  document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#reminderIconPicker .icon-btn').forEach(btn => {
    if (btn.dataset.icon === emoji) btn.classList.add('active');
  });
  
  document.getElementById('emojiPickerModal')?.classList.remove('active');
}

// ==================== COLOR PICKER ====================
function setupColorPicker() {
  const modal = document.getElementById('colorPickerModal');
  if (!modal) return;
  
  document.getElementById('closeColorModal')?.addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.classList.remove('active'));
  
  // More color button
  document.getElementById('moreColorBtn')?.addEventListener('click', () => {
    renderColorPalette();
    modal.classList.add('active');
  });
  
  // Initial render
  renderColorPalette();
}

function renderColorPalette() {
  const palette = document.getElementById('colorPalette');
  if (!palette) return;
  
  palette.innerHTML = TREND_COLORS.map(c => 
    `<button type="button" class="color-palette-item" style="background:${c}" data-color="${c}"></button>`
  ).join('');
  
  palette.querySelectorAll('.color-palette-item').forEach(btn => {
    btn.addEventListener('click', () => selectColor(btn.dataset.color));
  });
}

function selectColor(color) {
  document.getElementById('selectedColorPreview').style.background = color;
  document.getElementById('reminderColor').value = color;
  document.getElementById('customColorPicker').value = color;
  
  // Update active state in presets
  document.querySelectorAll('#reminderColorPicker .color-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#reminderColorPicker .color-btn').forEach(btn => {
    if (btn.dataset.color === color) btn.classList.add('active');
  });
  
  document.getElementById('colorPickerModal')?.classList.remove('active');
}

// ==================== UTILITIES ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function playNotificationSound(volume = 100) {
  const audio = document.getElementById('notificationSound');
  if (audio) {
    audio.volume = Math.min(volume / 100, 2);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}
