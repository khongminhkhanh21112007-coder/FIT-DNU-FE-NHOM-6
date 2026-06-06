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
* **Back-End / Cơ sở dữ liệu:** MockAPI (RESTful API chia làm 2 server độc lập để tránh nghẽn luồng dữ liệu)

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
📁 med-reminder/
│
├── 📄 index.html          # Giao diện trang chủ hiển thị lịch nhắc nhở hôm nay
├── 📄 admin.html          # Giao diện trang quản trị (Thuốc, Bệnh nhân, Tạo lịch)
│
├── 📁 css/
│   └── 📄 style.css       # Định dạng màu sắc, giao diện các thẻ card và hiệu ứng
│
└── 📁 js/
    ├── 📄 api.js          # Cấu hình gọi fetch API kết nối đến server MockAPI
    ├── 📄 main.js         # Logic điều khiển, render dữ liệu và bộ lọc tại index.html
    └── 📄 admin.js        # Logic quản lý thêm/sửa/xóa thuốc, bệnh nhân tại admin.html