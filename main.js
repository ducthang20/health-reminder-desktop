const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// API Configuration
const API_VERSION_URL = 'https://remind.asia/api-version-v2';
const API_CALL_INTERVAL = 30 * 60 * 1000; // 30 minutes
const APP_VERSION = '2.0.0';

let mainWindow;
let tray;
let reminderTimers = {};
let notificationWindow = null;
let apiInterval = null;

// ==================== API CALL ====================
async function callVersionAPI() {
  try {
    const settings = store.get('settings', {});
    const popupStats = store.get('popupStats', {});
    
    const response = await fetch(API_VERSION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: APP_VERSION,
        popupStats: popupStats,
        source: 'exe_windows',
        language: settings.language || 'vi'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Save list_message if exists
      if (data && data.list_message && Array.isArray(data.list_message)) {
        store.set('listMessage', data.list_message);
      }
      
      return data;
    }
    
    return null;
  } catch (error) {
    console.log('API call error:', error.message);
    return null;
  }
}

function setupAPIInterval() {
  // Call immediately on startup
  callVersionAPI();
  
  // Setup interval for periodic calls
  if (apiInterval) clearInterval(apiInterval);
  apiInterval = setInterval(() => {
    callVersionAPI();
  }, API_CALL_INTERVAL);
}

// Update popup stats when notification is shown
function updatePopupStats() {
  const today = new Date().toLocaleDateString('vi-VN');
  const popupStats = store.get('popupStats', {});
  popupStats[today] = (popupStats[today] || 0) + 1;
  store.set('popupStats', popupStats);
}

// Auto-start configuration
function setAutoStart(enable) {
  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: enable,
      path: process.execPath,
      args: ['--hidden']
    });
  } else if (process.platform === 'darwin') {
    app.setLoginItemSettings({
      openAtLogin: enable
    });
  } else if (process.platform === 'linux') {
    app.setLoginItemSettings({
      openAtLogin: enable
    });
  }
}

function getAutoStartStatus() {
  return app.getLoginItemSettings().openAtLogin;
}

function createWindow() {
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'icons/icon.ico')
    : path.join(__dirname, 'icons/icon128.png');
  
  // Check if started with --hidden flag
  const startHidden = process.argv.includes('--hidden');
    
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: true,
    show: false,
    backgroundColor: '#f8fafc'
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.once('ready-to-show', () => {
    if (!startHidden) {
      mainWindow.show();
    }
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const trayIcon = process.platform === 'win32'
    ? path.join(__dirname, 'icons/icon.ico')
    : path.join(__dirname, 'icons/icon16.png');
    
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Mở ứng dụng', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Thoát', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  
  tray.setToolTip('Health Reminder');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    mainWindow.show();
  });
}

function createNotificationWindow(reminder) {
  // Close existing notification if any
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
  }

  // Update popup stats
  updatePopupStats();

  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.size;
  
  notificationWindow = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  notificationWindow.loadFile('notification.html');
  
  notificationWindow.webContents.once('did-finish-load', () => {
    notificationWindow.webContents.send('show-reminder', reminder);
    // Play sound from notification window with delay to ensure page is fully loaded
    const settings = store.get('settings', { soundEnabled: true, soundVolume: 100 });
    if (settings.soundEnabled !== false) {
      setTimeout(() => {
        if (notificationWindow && !notificationWindow.isDestroyed()) {
          notificationWindow.webContents.send('play-sound', settings.soundVolume || 100);
        }
      }, 300);
    }
  });

  // Auto close after displayMinutes
  const duration = (reminder.displayMinutes || 1) * 60 * 1000;
  setTimeout(() => {
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.close();
    }
  }, duration);
}

function setupReminders() {
  // Clear existing timers
  Object.values(reminderTimers).forEach(timer => clearInterval(timer));
  reminderTimers = {};

  const reminders = store.get('reminders', []);
  const settings = store.get('settings', { enabled: true });
  
  if (!settings.enabled) return;

  const now = new Date();
  
  reminders.forEach(reminder => {
    if (!reminder.enabled) return;
    
    if (reminder.type === 'interval') {
      // Interval-based reminder
      const intervalMs = (reminder.interval || 30) * 60 * 1000;
      reminderTimers[reminder.id] = setInterval(() => {
        createNotificationWindow(reminder);
        playSound();
      }, intervalMs);
      
    } else if (reminder.type === 'scheduled' || reminder.type === 'dateRange') {
      // Scheduled reminders - check every minute
      reminderTimers[reminder.id] = setInterval(() => {
        checkScheduledReminder(reminder);
      }, 60 * 1000);
      
      // Also check immediately
      checkScheduledReminder(reminder);
    }
  });
}

function checkScheduledReminder(reminder) {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  if (!reminder.scheduledTimes) return;
  
  reminder.scheduledTimes.forEach(slot => {
    const matchDate = !slot.date || slot.date === currentDate;
    const matchTime = slot.time === currentTime;
    
    if (matchDate && matchTime) {
      createNotificationWindow(reminder);
      playSound();
    }
  });
}

function playSound() {
  // Sound is now played directly in notification window
  const settings = store.get('settings', { soundEnabled: true, soundVolume: 100 });
  if (settings.soundEnabled && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('play-sound', settings.soundVolume);
  }
}

// IPC Handlers
ipcMain.handle('get-reminders', () => {
  return store.get('reminders', []);
});

ipcMain.handle('save-reminders', (event, reminders) => {
  store.set('reminders', reminders);
  setupReminders();
  return true;
});

ipcMain.handle('get-settings', () => {
  return store.get('settings', {
    darkMode: false,
    soundEnabled: true,
    soundVolume: 100,
    language: 'vi',
    enabled: true,
    autoStart: false
  });
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  // Update auto-start
  if (typeof settings.autoStart !== 'undefined') {
    setAutoStart(settings.autoStart);
  }
  setupReminders();
  return true;
});

ipcMain.handle('get-auto-start', () => {
  return getAutoStartStatus();
});

ipcMain.handle('set-auto-start', (event, enable) => {
  setAutoStart(enable);
  return true;
});

ipcMain.on('close-notification', () => {
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
  }
});

ipcMain.on('preview-reminder', (event, reminder) => {
  createNotificationWindow(reminder);
  playSound();
});

app.whenReady().then(() => {
  createWindow();
  createTray();
  setupReminders();
  setupAPIInterval(); // Setup API calls
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
