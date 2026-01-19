# Changelog

Tất cả thay đổi đáng chú ý của dự án sẽ được ghi nhận trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án này tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-19

### 🎉 Major Release - Desktop App

Phiên bản này đánh dấu việc chuyển đổi từ Chrome Extension sang Desktop App sử dụng Electron.

### ✨ Added (Thêm mới)

- **Desktop App với Electron**
  - Hỗ trợ Windows, macOS, Linux
  - System tray với context menu
  - Khởi động cùng hệ điều hành
  
- **Emoji Picker Modal**
  - 400+ emoji được phân loại
  - 8 categories: Smileys, People, Nature, Food, Activities, Travel, Objects, Symbols
  - Grid layout với hover effects
  
- **Color Picker Modal**
  - 48 màu trend
  - Grid layout 8x6
  - Hover effects với border và shadow
  
- **Fullscreen Notification Popup**
  - Backdrop blur effect
  - Icon với hiệu ứng pulse animation
  - Progress bar đếm ngược thời gian hiển thị
  - Pause khi hover
  - Hỗ trợ Dark/Light mode tự động
  
- **Data Management**
  - Export dữ liệu ra file JSON
  - Import dữ liệu từ file JSON
  - Reset tất cả dữ liệu
  
- **Auto-start**
  - Khởi động cùng Windows
  - Khởi động cùng macOS
  - Khởi động cùng Linux
  
- **API Integration**
  - Gọi API version mỗi 30 phút
  - Gửi popup stats
  - Source: `exe_windows`

### 🔧 Changed (Thay đổi)

- **UI/UX cải thiện**
  - Reminder cards với design mới
  - Icon có nền màu với glow effect
  - Type badge với màu riêng biệt cho từng loại
  - Details section hiển thị thông tin chi tiết
  
- **Âm thanh thông báo**
  - Sử dụng đường dẫn tuyệt đối cho audio
  - Thêm delay để đảm bảo audio được load
  - Retry mechanism khi phát lỗi
  
- **Settings**
  - Volume slider 0-200%
  - Auto-start toggle
  - Language selector

### 🐛 Fixed (Sửa lỗi)

- Fix lỗi âm thanh không phát khi hiển thị notification
- Fix lỗi notification không hiển thị đúng vị trí
- Fix lỗi icon.ico cho Windows

### 📦 Dependencies

- electron: ^28.0.0
- electron-store: ^8.1.0
- electron-builder: ^24.9.1

---

## [1.x.x] - Previous Versions

Các phiên bản trước đây là Chrome Extension.

Xem chi tiết tại: [Chrome Extension Repository](https://github.com/user/health-reminder-extension)

---

## Links

- [GitHub Repository](https://github.com/user/health-reminder-desktop)
- [Download Releases](https://github.com/user/health-reminder-desktop/releases)
- [Report Issues](https://github.com/user/health-reminder-desktop/issues)
- [Website](https://noti.vn)
