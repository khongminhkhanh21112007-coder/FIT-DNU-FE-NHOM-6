# 💊 MedReminder - Hệ Thống Nhắc Nhở Uống Thuốc

Hệ thống ứng dụng web quản lý danh mục thuốc, danh sách bệnh nhân và thiết lập lịch nhắc nhở uống thuốc theo thời gian thực dành cho các phòng khám, bệnh viện hoặc hộ gia đình.

---

## 🚀 Tính Năng Chính

### 1. Trang Chủ (Giao diện hiển thị lịch nhắc)
* **Theo dõi lịch uống thuốc:** Hiển thị danh sách nhắc nhở trực quan dưới dạng các thẻ (Card) theo ngày.
* **Lọc & Tìm kiếm:** Lọc lịch nhắc theo ngày, trạng thái ("Chưa uống" / "Đã uống") hoặc tìm kiếm nhanh theo tên bệnh nhân.
* **Cập nhật nhanh trạng thái:** Click trực tiếp vào thẻ trạng thái để chuyển đổi qua lại giữa `⏳ Chưa uống` và `✓ Đã uống` (Chữ thẳng, nền đổi màu xanh tươi mát, không gạch ngang chữ).
* **Xóa lịch nhắc trực tiếp:** Tích hợp nút xóa nhanh lịch trình bị lỗi ngay trên thẻ.

### 2. Trang Quản Trị (Admin Dashboard)
* **Kho Danh Mục Thuốc:** Khai báo, chỉnh sửa thông tin liều lượng, bác sĩ kê đơn và xóa thuốc.
* **Quản Lý Bệnh Nhân:** * Hiển thị bảng danh sách bệnh nhân ngay ngắn kèm theo mã định danh tự động (`BN-1`, `BN-2`...) và tag bệnh lý cụ thể.
  * Thêm nhanh bệnh nhân mới qua hộp thoại nhập liệu (`prompt`) tiện lợi bằng nút bấm trên thanh tiêu đề, không làm biến đổi cấu trúc giao diện gốc.
* **Thiết Lập Giờ Nhắc Lịch:** Chọn bệnh nhân, chọn loại thuốc kê đơn, đặt ngày giờ cụ thể cùng ghi chú để tạo lịch nhắc nhở tức thì lên hệ thống.

---

## 🛠️ Công Nghệ Sử Dụng

* **Front-End:** HTML5, CSS3, JavaScript (ES6)
* **Framework giao diện:** Bootstrap 5 (Giao diện Responsive, hiển thị mượt mà trên cả máy tính lẫn điện thoại)
* **Thư viện tương tác:** jQuery (Xử lý DOM, đồng bộ API, bắt sự kiện bất đồng bộ)
* **Back-End / Cơ sở dữ liệu:** MockAPI (RESTful API kết nối cơ sở dữ liệu)

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
FIT-DNU-FE-NHOM-6/
├── CSS/
│   └── style.css          # File chứa toàn bộ mã nguồn CSS tùy chỉnh giao diện
├── js/
│   ├── api.js             # Cấu hình gọi API (Fetch/Axios) kết nối cơ sở dữ liệu
│   ├── utils.js           # Các hàm tiện ích bổ trợ (Validation, định dạng dữ liệu)
│   ├── main.js            # Xử lý logic giao diện người dùng (index.html)
│   └── admin.js           # Xử lý logic nghiệp vụ Form/Table (admin.html)
├── admin.html             # Giao diện trang quản trị viên (Thêm, Sửa, Xóa thuốc)
├── index.html             # Giao diện trang chủ hiển thị lịch nhắc cho khách hàng
└── README.md              # Tài liệu hướng dẫn sử dụng dự án