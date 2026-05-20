# 💊 MedReminder - Hệ Thống Quản Lý Lịch Nhắc Uống Thuốc

Ứng dụng web hỗ trợ người dùng theo dõi, tìm kiếm danh mục thuốc và cài đặt lịch nhắc nhở uống thuốc đúng giờ. Dự án bao gồm giao diện dành cho khách hàng (`index.html`) và giao diện quản trị (`admin.html`) phục vụ các thao tác Quản lý (CRUD) danh sách thuốc.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
FIT-DNU-FE-NHOM-6/
├── CSS/
│   └── style.css          # File chứa toàn bộ mã nguồn CSS tùy chỉnh giao diện
├── img/                   # Thư mục lưu trữ hình ảnh tĩnh hệ thống
├── js/
│   ├── api.js             # Cấu hình gọi API (Fetch/Axios) kết nối cơ sở dữ liệu
│   ├── utils.js           # Các hàm tiện ích bổ trợ (Validation, định dạng dữ liệu)
│   ├── main.js            # Xử lý logic giao diện người dùng (index.html)
│   └── admin.js           # Xử lý logic nghiệp vụ Form/Table (admin.html)
├── admin.html             # Giao diện trang quản trị viên (Thêm, Sửa, Xóa thuốc)
├── index.html             # Giao diện trang chủ hiển thị lịch nhắc cho khách hàng
└── README.md              # Tài liệu hướng dẫn sử dụng dự án