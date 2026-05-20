const API_URL = "https://6a0d6219769682b8ee7614ef.mockapi.io/api/v1/medications";// <-- THAY THẾ LINK MOCKAPI CỦA BẠN VÀO ĐÂY

const API = {
    // 1. GET - Lấy toàn bộ danh sách thuốc
    getAll: () => {
        return fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error("Không thể tải dữ liệu từ máy chủ.");
                return response.json();
            });
    },

    // 2. POST - Thêm mới thuốc
    create: (data) => {
        return fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            if (!res.ok) throw new Error("Lỗi khi thêm thuốc mới.");
            return res.json();
        });
    },

    // 3. PUT - Cập nhật thông tin thuốc (Hoặc đổi trạng thái Đã Uống ⭐)
    update: (id, data) => {
        return fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            if (!res.ok) throw new Error("Lỗi khi cập nhật dữ liệu.");
            return res.json();
        });
    },

    // 4. DELETE - Xóa thuốc khỏi danh sách
    delete: (id) => {
        return fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        }).then(res => {
            if (!res.ok) throw new Error("Lỗi khi thực hiện xóa.");
            return res.json();
        });
    }
};