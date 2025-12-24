// Preload Script
// Bridge giữa main process và renderer

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Storage operations
  getData: () => ipcRenderer.invoke('get-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // Alarm operations
  updateAlarms: () => ipcRenderer.invoke('update-alarms'),
  testReminder: (reminder) => ipcRenderer.invoke('test-reminder', reminder),
  
  // Notification
  dismissNotification: () => ipcRenderer.invoke('dismiss-notification'),
  
  // Event listeners
  onShowReminder: (callback) => {
    ipcRenderer.on('show-reminder', (event, data) => callback(data));
  },
  onSettingsUpdated: (callback) => {
    ipcRenderer.on('settings-updated', (event, settings) => callback(settings));
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Expose platform info
contextBridge.exposeInMainWorld('platform', {
  isElectron: true,
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
});
