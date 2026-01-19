# Đóng góp cho Health Reminder Desktop

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án! 🎉

## 📋 Quy trình đóng góp

### 1. Fork Repository

Click nút "Fork" ở góc trên bên phải của trang repository.

### 2. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/health-reminder-desktop.git
cd health-reminder-desktop
```

### 3. Tạo Branch mới

```bash
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-loi
```

### 4. Cài đặt Dependencies

```bash
npm install
```

### 5. Chạy ứng dụng ở chế độ development

```bash
npm start
```

### 6. Thực hiện thay đổi

- Viết code theo chuẩn đã có trong dự án
- Đảm bảo code chạy được và không có lỗi
- Test kỹ các tính năng mới hoặc bug fix

### 7. Commit changes

```bash
git add .
git commit -m "feat: mô tả ngắn gọn về tính năng"
# hoặc
git commit -m "fix: mô tả ngắn gọn về bug fix"
```

**Commit message format:**
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Thay đổi documentation
- `style:` - Thay đổi style (CSS, formatting)
- `refactor:` - Refactor code
- `test:` - Thêm tests
- `chore:` - Các thay đổi khác (build, config)

### 8. Push to GitHub

```bash
git push origin feature/ten-tinh-nang
```

### 9. Tạo Pull Request

1. Vào repository gốc trên GitHub
2. Click "New Pull Request"
3. Chọn branch của bạn
4. Điền mô tả chi tiết về thay đổi
5. Submit Pull Request

## 🐛 Báo cáo Bug

Khi báo cáo bug, vui lòng cung cấp:

1. **Mô tả bug**: Bug xảy ra như thế nào?
2. **Các bước tái tạo**: Làm thế nào để tái tạo bug?
3. **Kết quả mong đợi**: Bạn mong đợi điều gì xảy ra?
4. **Kết quả thực tế**: Điều gì thực sự xảy ra?
5. **Screenshots**: Nếu có thể
6. **Môi trường**:
   - OS: Windows/macOS/Linux version
   - App version: x.x.x

## 💡 Đề xuất tính năng

Khi đề xuất tính năng mới, vui lòng:

1. Kiểm tra xem đã có ai đề xuất chưa
2. Mô tả rõ ràng tính năng
3. Giải thích tại sao tính năng này hữu ích
4. Đưa ra ví dụ về cách sử dụng

## 📝 Coding Standards

### JavaScript

- Sử dụng ES6+ syntax
- Sử dụng `const` và `let`, tránh `var`
- Sử dụng arrow functions khi thích hợp
- Comment code phức tạp

### CSS

- Sử dụng CSS variables đã định nghĩa
- Mobile-first approach
- BEM naming convention (nếu cần thiết)

### HTML

- Semantic HTML5
- Accessibility (a11y) best practices
- Data attributes cho JavaScript hooks

## 🔧 Development Setup

### Cấu trúc dự án

```
health-reminder-desktop/
├── main.js              # Main process
├── index.html           # UI
├── notification.html    # Notification window
├── styles.css           # Styles
├── app.js              # Renderer logic
├── i18n.js             # Translations
├── package.json
├── icons/
└── sounds/
```

### Debug

Mở DevTools trong Electron:

```javascript
// Trong main.js
mainWindow.webContents.openDevTools();
```

### Build test

```bash
# Build cho platform hiện tại
npm run build

# Build cho platform cụ thể
npm run build:win
npm run build:mac
npm run build:linux
```

## 📄 License

Bằng việc đóng góp cho dự án này, bạn đồng ý rằng đóng góp của bạn sẽ được cấp phép theo MIT License.

## 🙏 Cảm ơn

Cảm ơn tất cả những người đã đóng góp cho dự án!

---

Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại tạo Issue hoặc liên hệ qua:
- Facebook: [remind.asia](https://www.facebook.com/remind.asia/)
- Website: [noti.vn](https://noti.vn)
