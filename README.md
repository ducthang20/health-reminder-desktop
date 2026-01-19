# Health Reminder Desktop App

<p align="center">
  <img src="icons/icon128.png" alt="Health Reminder Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Ứng dụng nhắc nhở sức khỏe cho Windows/macOS/Linux</strong>
</p>

<p align="center">
  <a href="#tính-năng">Tính năng</a> •
  <a href="#cài-đặt">Cài đặt</a> •
  <a href="#sử-dụng">Sử dụng</a> •
  <a href="#build">Build</a> •
  <a href="#changelog">Changelog</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg" alt="Platform">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/main-window.png" alt="Main Window" width="400">
  <img src="screenshots/notification.png" alt="Notification" width="400">
</p>

## ✨ Tính năng

### 🔔 Nhắc nhở thông minh
- **Lặp lại theo khoảng thời gian** - Nhắc nhở mỗi X phút (15/30/60/90 phút)
- **Theo giờ cố định** - Chọn ngày giờ cụ thể để nhắc nhở
- **Theo khoảng ngày** - Thiết lập nhắc nhở trong một khoảng thời gian với các ngày trong tuần tùy chọn

### 🎨 Tùy chỉnh đa dạng
- **Icon Emoji** - Chọn từ 400+ emoji được phân loại theo 8 nhóm
- **Màu sắc** - 48 màu trend + color picker tùy chỉnh
- **Hình ảnh** - Thêm URL hình ảnh vào thông báo
- **Thời gian hiển thị** - Tùy chỉnh thời gian popup (1/2/5 phút)

### 🌐 Đa ngôn ngữ
- 🇻🇳 Tiếng Việt
- 🇺🇸 English

### 🎯 Tính năng khác
- **Dark/Light Mode** - Giao diện sáng/tối theo sở thích
- **System Tray** - Chạy nền, không chiếm taskbar
- **Khởi động cùng Windows** - Tự động mở khi khởi động máy
- **Export/Import** - Sao lưu và khôi phục dữ liệu
- **Âm thanh thông báo** - Với điều chỉnh âm lượng (0-200%)

### 🖥️ Popup thông báo
- Hiển thị fullscreen với backdrop blur
- Animation mượt mà
- Icon với hiệu ứng pulse
- Progress bar đếm ngược
- Pause khi hover
- Dark/Light mode tự động

## 📥 Cài đặt

### Yêu cầu hệ thống
- Windows 10/11, macOS 10.14+, hoặc Linux
- Node.js 18+ (chỉ cần khi build từ source)

### Tải bản cài đặt
Tải file cài đặt tương ứng với hệ điều hành từ [Releases](https://github.com/user/health-reminder-desktop/releases):

| Platform | Download |
|----------|----------|
| Windows | `Health-Reminder-Setup-2.0.0.exe` |
| macOS | `Health-Reminder-2.0.0.dmg` |
| Linux | `Health-Reminder-2.0.0.AppImage` |

### Cài đặt từ source

```bash
# Clone repository
git clone https://github.com/user/health-reminder-desktop.git
cd health-reminder-desktop

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

## 📖 Sử dụng

### Thêm nhắc nhở mới

1. Click nút **"+ Thêm nhắc nhở"**
2. Nhập thông điệp nhắc nhở
3. Chọn icon (click "⋯" để xem thêm emoji)
4. Chọn màu sắc (click "⋯" để xem thêm màu)
5. Chọn loại nhắc nhở:
   - **Interval**: Lặp lại mỗi X phút
   - **Fixed Time**: Chọn ngày giờ cụ thể
   - **Date Range**: Chọn khoảng ngày + ngày trong tuần
6. Click **"Lưu"**

### Cài đặt

- **Giao diện tối**: Bật/tắt dark mode
- **Ngôn ngữ**: Chọn Tiếng Việt hoặc English
- **Âm thanh**: Bật/tắt và điều chỉnh âm lượng
- **Khởi động cùng Windows**: Tự động mở app khi khởi động
- **Export/Import**: Sao lưu và khôi phục dữ liệu

## 🔧 Build

### Build cho tất cả platforms

```bash
npm run build
```

### Build cho từng platform

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

Output sẽ được lưu trong thư mục `dist/`.

## 📁 Cấu trúc dự án

```
health-reminder-desktop/
├── main.js              # Electron main process
├── index.html           # Main UI
├── notification.html    # Popup notification window
├── styles.css           # UI styles
├── app.js              # Application logic
├── i18n.js             # Internationalization
├── package.json        # Dependencies & scripts
├── icons/              # App icons
│   ├── icon.ico        # Windows icon
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── sounds/             # Notification sounds
    ├── notification.wav
    └── message.wav
```

## 📋 Changelog

### v2.0.0 (2025-01-19)
**🎉 Major Release - Desktop App**

#### ✨ New Features
- Chuyển đổi từ Chrome Extension sang Desktop App (Electron)
- Emoji Picker với 400+ emoji, 8 categories
- Color Picker với 48 màu trend
- Khởi động cùng Windows/macOS/Linux
- Fullscreen notification popup với backdrop blur
- Progress bar đếm ngược thời gian hiển thị
- Pause notification khi hover
- Export/Import data dạng JSON

#### 🔧 Improvements
- UI/UX được cải thiện với design mới cho reminder cards
- Âm thanh thông báo với điều chỉnh volume (0-200%)
- Dark/Light mode theo system hoặc tùy chọn
- System tray với context menu

#### 🐛 Bug Fixes
- Fix lỗi âm thanh không phát
- Fix lỗi notification không hiển thị đúng vị trí

### v1.x.x (Previous)
- Chrome Extension version
- Xem changelog tại [extension repository](https://github.com/user/health-reminder-extension)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Noti VN**
- Website: [noti.vn](https://noti.vn)
- Facebook: [remind.asia](https://www.facebook.com/remind.asia/)

---

<p align="center">
  Made with ❤️ by <a href="https://noti.vn">Noti VN</a>
</p>
