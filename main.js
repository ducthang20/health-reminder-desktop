// Main Process - Electron
// Xử lý scheduling, notifications và system tray

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const schedule = require('node-schedule');

// Fix Vietnamese IME input (Unikey, EVKey, etc.)
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion,HardwareMediaKeyHandling');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('lang', 'vi');

// Initialize store
const store = new Store({
  defaults: {
    reminders: [
      {
        id: 'default-water',
        message: 'Đã đến lúc uống nước rồi!',
        color: '#0ea5e9',
        type: 'interval',
        interval: 30,
        enabled: true,
        icon: '💧',
        displayMinutes: 1
      },
      {
        id: 'default-standup',
        message: 'Đứng dậy đi lại một chút nhé!',
        color: '#22c55e',
        type: 'interval',
        interval: 60,
        enabled: true,
        icon: '🚶',
        displayMinutes: 1
      }
    ],
    settings: {
      darkMode: false,
      soundEnabled: true,
      soundVolume: 30,
      enabled: true,
      startMinimized: false,
      startWithWindows: false
    }
  }
});

// Global references
let mainWindow = null;
let notificationWindow = null;
let tray = null;
let scheduledJobs = {};
let intervalTimers = {};

// Create main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    minWidth: 380,
    minHeight: 500,
    resizable: true,
    frame: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false
    },
    show: !store.get('settings.startMinimized', false)
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle window close - minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create notification overlay window
function createNotificationWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  notificationWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  notificationWindow.loadFile(path.join(__dirname, 'renderer', 'notification.html'));
  
  // Allow click-through when not showing notification
  notificationWindow.setIgnoreMouseEvents(true, { forward: true });
  
  // Open external links in default browser
  notificationWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Show notification
function showNotification(reminder) {
  if (!notificationWindow) {
    createNotificationWindow();
  }

  const settings = store.get('settings', {});
  
  // Make window interactive
  notificationWindow.setIgnoreMouseEvents(false);
  notificationWindow.show();
  notificationWindow.focus();

  // Send reminder data to notification window
  notificationWindow.webContents.send('show-reminder', {
    reminder,
    darkMode: settings.darkMode || false,
    soundEnabled: settings.soundEnabled !== false,
    soundVolume: settings.soundVolume || 30
  });
}

// Hide notification
function hideNotification() {
  if (notificationWindow) {
    notificationWindow.setIgnoreMouseEvents(true, { forward: true });
    notificationWindow.hide();
  }
}

// Clear all alarms
function clearAllAlarms() {
  // Clear interval timers
  Object.values(intervalTimers).forEach(timer => {
    if (timer) clearInterval(timer);
  });
  intervalTimers = {};

  // Clear scheduled jobs
  Object.values(scheduledJobs).forEach(job => {
    if (job && typeof job.cancel === 'function') {
      job.cancel();
    }
  });
  scheduledJobs = {};
}

// Setup alarms/schedules
function setupAlarms() {
  // Clear existing alarms first
  clearAllAlarms();

  const settings = store.get('settings', {});
  if (!settings.enabled) {
    console.log('Reminders disabled, not setting up alarms');
    return;
  }

  const reminders = store.get('reminders', []);
  console.log('Setting up alarms for', reminders.length, 'reminders');
  
  reminders.forEach(reminder => {
    if (reminder.type === 'interval' && reminder.interval > 0) {
      // Interval-based reminder - convert minutes to milliseconds
      const intervalMs = reminder.interval * 60 * 1000;
      console.log(`Setting interval for ${reminder.id}: ${reminder.interval} minutes (${intervalMs}ms)`);
      
      intervalTimers[reminder.id] = setInterval(() => {
        console.log('Triggering interval reminder:', reminder.id);
        showNotification(reminder);
      }, intervalMs);
      
    } else if (reminder.type === 'scheduled' && reminder.times && reminder.times.length > 0) {
      // Scheduled reminder - specific times daily
      reminder.times.forEach((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        
        const rule = new schedule.RecurrenceRule();
        rule.hour = hours;
        rule.minute = minutes;
        rule.second = 0;
        
        const jobId = `${reminder.id}-${index}`;
        console.log(`Setting scheduled job ${jobId} for ${hours}:${minutes}`);
        
        scheduledJobs[jobId] = schedule.scheduleJob(rule, () => {
          console.log('Triggering scheduled reminder:', reminder.id);
          showNotification(reminder);
        });
      });
    }
  });
}

// Create system tray
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.ico');
  let trayIcon;
  
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Fallback to PNG if ICO fails
      const pngPath = path.join(__dirname, 'assets', 'icon.png');
      trayIcon = nativeImage.createFromPath(pngPath);
    }
  } catch (e) {
    console.error('Error loading tray icon:', e);
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Nhắc nhở sức khỏe');

  const updateTrayMenu = () => {
    const settings = store.get('settings', {});
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Mở ứng dụng',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      { type: 'separator' },
      {
        label: settings.enabled ? '✓ Đang bật nhắc nhở' : '✗ Đã tắt nhắc nhở',
        click: () => {
          const newSettings = { ...settings, enabled: !settings.enabled };
          store.set('settings', newSettings);
          setupAlarms();
          updateTrayMenu();
          
          if (mainWindow) {
            mainWindow.webContents.send('settings-updated', newSettings);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Thoát',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);
  };

  updateTrayMenu();

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Store reference to update function
  tray.updateMenu = updateTrayMenu;
}

// Setup IPC handlers
function setupIpcHandlers() {
  // Get data
  ipcMain.handle('get-data', () => {
    return {
      reminders: store.get('reminders', []),
      settings: store.get('settings', {})
    };
  });

  // Save data
  ipcMain.handle('save-data', (event, data) => {
    if (data.reminders !== undefined) {
      store.set('reminders', data.reminders);
    }
    if (data.settings !== undefined) {
      store.set('settings', data.settings);
      
      // Handle startup with Windows
      if (data.settings.startWithWindows !== undefined) {
        app.setLoginItemSettings({
          openAtLogin: data.settings.startWithWindows,
          path: app.getPath('exe')
        });
      }
    }
    return true;
  });

  // Update alarms
  ipcMain.handle('update-alarms', () => {
    setupAlarms();
    if (tray && tray.updateMenu) {
      tray.updateMenu();
    }
    return true;
  });

  // Test reminder
  ipcMain.handle('test-reminder', (event, reminder) => {
    showNotification(reminder);
    return true;
  });

  // Dismiss notification
  ipcMain.handle('dismiss-notification', () => {
    hideNotification();
    return true;
  });
}

// App ready
app.whenReady().then(() => {
  createMainWindow();
  createNotificationWindow();
  createTray();
  setupIpcHandlers();
  
  // Setup alarms after a short delay to ensure everything is ready
  setTimeout(() => {
    setupAlarms();
  }, 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  app.isQuitting = true;
  clearAllAlarms();
});
