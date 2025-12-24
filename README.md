# Nhắc nhở sức khỏe - Desktop App

Ứng dụng nhắc nhở uống nước, đứng dậy đi lại khi làm việc. Phiên bản desktop cho Windows.

## Tính năng

- 💧 Nhắc nhở uống nước định kỳ
- 🚶 Nhắc nhở đứng dậy đi lại
- ⏰ Hỗ trợ nhắc theo khoảng thời gian hoặc giờ cố định
- 🌙 Giao diện sáng/tối
- 🔔 Âm thanh thông báo tùy chỉnh
- 📌 Chạy nền trong system tray
- 🚀 Khởi động cùng Windows (tùy chọn)

## Cài đặt

### Yêu cầu
- Node.js 14.x trở lên
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy development

```bash
npm start
```

### Build file .exe

```bash
npm run build
```

File `NhacNhoSucKhoe.exe` sẽ được tạo trong thư mục `dist/`

## Cấu trúc project

```
health-reminder-desktop/
├── assets/
│   └── icon.ico          # Icon ứng dụng
├── renderer/
│   ├── index.html        # Giao diện chính
│   ├── notification.html # Giao diện thông báo
│   ├── app.js            # Logic UI
│   └── styles.css        # CSS styles
├── main.js               # Electron main process
├── preload.js            # Preload script
└── package.json
```

## Sử dụng

1. **Tab Nhắc nhở**: Xem danh sách các nhắc nhở đã tạo
2. **Tab Thêm mới**: Tạo nhắc nhở mới với:
   - Thông điệp tùy chỉnh
   - Biểu tượng và màu sắc
   - Loại nhắc: định kỳ hoặc giờ cố định
   - Thời gian hiển thị thông báo
3. **Tab Cài đặt**: Tùy chỉnh giao diện, âm thanh, khởi động

## Icon

Đặt file `icon.ico` vào thư mục `assets/`. File icon cần chứa các kích thước: 16x16, 32x32, 48x48, 256x256 pixels.

## Tác giả

**Noti VN** - [noti.vn](https://noti.vn)

## License

MIT License
