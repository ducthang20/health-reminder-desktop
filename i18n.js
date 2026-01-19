// i18n.js - Internationalization module for Desktop App
// Supports English and Vietnamese

const i18n = {
  currentLang: 'vi',
  
  translations: {
    en: {
      // App
      appTitle: 'Health Reminder',
      
      // Tabs
      tabReminders: 'Reminders',
      tabSettings: 'Settings',
      
      // Master toggle
      statusEnabled: 'Enabled',
      statusDisabled: 'Disabled',
      
      // Reminders
      remindersSubtitle: 'Manage your health reminders',
      addReminder: 'Add Reminder',
      editReminder: 'Edit Reminder',
      noReminders: 'No reminders yet',
      addFirstReminder: 'Add your first reminder',
      reminderDetail: 'Reminder Detail',
      reminderSaved: 'Reminder saved!',
      reminderDeleted: 'Reminder deleted!',
      confirmDeleteReminder: 'Delete this reminder?',
      
      // Reminder Form
      message: 'Message',
      enterMessage: 'Enter reminder message...',
      icon: 'Icon',
      messageColor: 'Message color',
      imageUrl: 'Image URL (optional)',
      imageUrlPlaceholder: 'https://example.com/image.png',
      imageUrlHint: 'Supported: .png, .jpg, .jpeg, .gif, .webp, .svg',
      invalidImageUrl: 'Invalid image URL format',
      reminderType: 'Reminder type',
      repeatByInterval: 'Repeat by interval',
      atFixedTime: 'At fixed time',
      dateRange: 'Date Range',
      repeatEveryMinutes: 'Repeat every (minutes)',
      reminderTimes: 'Reminder times',
      addTime: 'Add time',
      displayDuration: 'Display duration (minutes)',
      preview: 'Preview',
      previewSent: 'Preview sent!',
      saveReminder: 'Save',
      
      // Date Range
      dateRangeSettings: 'Date Range Settings',
      fromDate: 'From',
      toDate: 'To',
      timeSlots: 'Time slots',
      selectDateRange: 'Select date range to see summary',
      selectDays: 'Please select at least one day',
      noMatchingDates: 'No matching dates found',
      addTimeError: 'Please add at least one time',
      
      // Weekdays
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      
      // Time info
      repeatEvery: 'Repeat every',
      minutes: 'minutes',
      reminders: 'reminders',
      totalReminders: 'Total reminders',
      weekdays: 'Days',
      
      // Actions
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      
      // Emoji & Color Picker
      selectEmoji: 'Select Emoji',
      selectColor: 'Select Color',
      
      // Settings
      settingsSubtitle: 'Customize application',
      appearance: 'Appearance',
      darkMode: 'Dark mode',
      darkModeDesc: 'Easier on eyes',
      language: 'Language',
      languageDesc: 'Select language',
      notifications: 'Notifications',
      soundNotification: 'Sound',
      soundDesc: 'Play sound on notification',
      notificationVolume: 'Volume',
      volumeDesc: 'Adjust volume',
      system: 'System',
      autoStart: 'Start with Windows',
      autoStartDesc: 'Launch app when Windows starts',
      dataManagement: 'Data Management',
      exportData: 'Export',
      importData: 'Import',
      resetAll: 'Reset All',
      confirmReset: 'Reset all data? This cannot be undone.',
      dataExported: 'Data exported!',
      dataImported: 'Data imported!',
      dataReset: 'Data reset!',
      about: 'About',
      version: 'Version',
      createdBy: 'Created by',
      
      // Default reminders
      defaultWaterReminder: 'Time to drink water!',
      defaultStandupReminder: 'Time to stand up and stretch!'
    },
    
    vi: {
      // App
      appTitle: 'Nhắc nhở sức khỏe',
      
      // Tabs
      tabReminders: 'Nhắc nhở',
      tabSettings: 'Cài đặt',
      
      // Master toggle
      statusEnabled: 'Đã bật',
      statusDisabled: 'Đã tắt',
      
      // Reminders
      remindersSubtitle: 'Quản lý nhắc nhở sức khỏe',
      addReminder: 'Thêm nhắc nhở',
      editReminder: 'Sửa nhắc nhở',
      noReminders: 'Chưa có nhắc nhở nào',
      addFirstReminder: 'Thêm nhắc nhở đầu tiên',
      reminderDetail: 'Chi tiết nhắc nhở',
      reminderSaved: 'Đã lưu nhắc nhở!',
      reminderDeleted: 'Đã xóa nhắc nhở!',
      confirmDeleteReminder: 'Xóa nhắc nhở này?',
      
      // Reminder Form
      message: 'Thông điệp',
      enterMessage: 'Nhập thông điệp nhắc nhở...',
      icon: 'Biểu tượng',
      messageColor: 'Màu sắc thông điệp',
      imageUrl: 'Link ảnh (tùy chọn)',
      imageUrlPlaceholder: 'https://example.com/image.png',
      imageUrlHint: 'Hỗ trợ: .png, .jpg, .jpeg, .gif, .webp, .svg',
      invalidImageUrl: 'Link ảnh không hợp lệ',
      reminderType: 'Loại nhắc nhở',
      repeatByInterval: 'Lặp lại theo thời gian',
      atFixedTime: 'Theo giờ cố định',
      dateRange: 'Khoảng ngày',
      repeatEveryMinutes: 'Lặp lại mỗi (phút)',
      reminderTimes: 'Giờ nhắc nhở',
      addTime: 'Thêm giờ',
      displayDuration: 'Thời gian hiển thị (phút)',
      preview: 'Xem trước',
      previewSent: 'Đã gửi xem trước!',
      saveReminder: 'Lưu',
      
      // Date Range
      dateRangeSettings: 'Cài đặt khoảng ngày',
      fromDate: 'Từ ngày',
      toDate: 'Đến ngày',
      timeSlots: 'Khung giờ',
      selectDateRange: 'Chọn khoảng ngày để xem tổng kết',
      selectDays: 'Vui lòng chọn ít nhất một ngày',
      noMatchingDates: 'Không tìm thấy ngày phù hợp',
      addTimeError: 'Vui lòng thêm ít nhất một khung giờ',
      
      // Weekdays
      sun: 'CN',
      mon: 'T2',
      tue: 'T3',
      wed: 'T4',
      thu: 'T5',
      fri: 'T6',
      sat: 'T7',
      
      // Time info
      repeatEvery: 'Lặp lại mỗi',
      minutes: 'phút',
      reminders: 'nhắc nhở',
      totalReminders: 'Tổng nhắc nhở',
      weekdays: 'Các ngày',
      
      // Actions
      edit: 'Sửa',
      delete: 'Xóa',
      close: 'Đóng',
      
      // Emoji & Color Picker
      selectEmoji: 'Chọn Emoji',
      selectColor: 'Chọn màu sắc',
      
      // Settings
      settingsSubtitle: 'Tùy chỉnh ứng dụng',
      appearance: 'Giao diện',
      darkMode: 'Giao diện tối',
      darkModeDesc: 'Dễ nhìn hơn trong điều kiện ánh sáng yếu',
      language: 'Ngôn ngữ',
      languageDesc: 'Chọn ngôn ngữ',
      notifications: 'Thông báo',
      soundNotification: 'Âm thanh',
      soundDesc: 'Phát âm thanh khi hiển thị nhắc nhở',
      notificationVolume: 'Âm lượng',
      volumeDesc: 'Điều chỉnh độ to của âm thanh',
      system: 'Hệ thống',
      autoStart: 'Khởi động cùng Windows',
      autoStartDesc: 'Tự động mở ứng dụng khi khởi động Windows',
      dataManagement: 'Quản lý dữ liệu',
      exportData: 'Xuất dữ liệu',
      importData: 'Nhập dữ liệu',
      resetAll: 'Đặt lại tất cả',
      confirmReset: 'Đặt lại tất cả dữ liệu? Hành động này không thể hoàn tác.',
      dataExported: 'Đã xuất dữ liệu!',
      dataImported: 'Đã nhập dữ liệu!',
      dataReset: 'Đã đặt lại dữ liệu!',
      about: 'Giới thiệu',
      version: 'Phiên bản',
      createdBy: 'Được tạo bởi',
      
      // Default reminders
      defaultWaterReminder: 'Đã đến lúc uống nước rồi!',
      defaultStandupReminder: 'Đứng dậy đi lại một chút nhé!'
    }
  },

  // Initialize - load language from settings
  async init() {
    // Try to get from Electron store
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        const settings = await ipcRenderer.invoke('get-settings');
        if (settings && settings.language) {
          this.currentLang = settings.language;
        }
      } catch (e) {
        // Fallback to localStorage for browser
        const saved = localStorage.getItem('language');
        if (saved) this.currentLang = saved;
      }
    } else {
      const saved = localStorage.getItem('language');
      if (saved) this.currentLang = saved;
    }
    
    this.applyTranslations();
    return this.currentLang;
  },

  // Get translation
  t(key) {
    const trans = this.translations[this.currentLang];
    return trans && trans[key] ? trans[key] : (this.translations.en[key] || key);
  },

  // Set language
  async setLanguage(lang) {
    if (!this.translations[lang]) return;
    
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Save to Electron store
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        const settings = await ipcRenderer.invoke('get-settings');
        settings.language = lang;
        await ipcRenderer.invoke('save-settings', settings);
      } catch (e) {}
    }
    
    this.applyTranslations();
  },

  // Apply translations to DOM
  applyTranslations() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const trans = this.t(key);
      if (trans) el.textContent = trans;
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const trans = this.t(key);
      if (trans) el.placeholder = trans;
    });
    
    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const trans = this.t(key);
      if (trans) el.title = trans;
    });
  },

  // Toggle language
  toggleLanguage() {
    const newLang = this.currentLang === 'vi' ? 'en' : 'vi';
    this.setLanguage(newLang);
    return newLang;
  }
};

// Make globally available
window.i18n = i18n;
