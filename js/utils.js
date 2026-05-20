const Utils = {
    // Hàm hiển thị thông báo Toast nhanh chóng
    showToast: (toastId, messageId, message, isSuccess = true) => {
        const toastEl = document.getElementById(toastId);
        document.getElementById(messageId).innerText = message;
        if(isSuccess) {
            toastEl.classList.remove('bg-danger');
            toastEl.classList.add('bg-success');
        } else {
            toastEl.classList.remove('bg-success');
            toastEl.classList.add('bg-danger');
        }
        const bsToast = new bootstrap.Toast(toastEl);
        bsToast.show();
    },

    // Form Validation (Dùng Javascript Thuần để kiểm tra dữ liệu đầu vào)
    validateMedicationForm: () => {
        let isValid = true;

        const name = document.getElementById('med-name');
        const category = document.getElementById('med-category');
        const dosage = document.getElementById('med-dosage');
        const time = document.getElementById('med-time');
        const image = document.getElementById('med-image');

        // Reset trạng thái lỗi cũ trước khi check mới
        [name, category, dosage, time, image].forEach(el => el.classList.remove('is-invalid'));

        // Kiểm tra Tên thuốc không rỗng
        if (!name.value.trim()) {
            name.classList.add('is-invalid');
            isValid = false;
        }
        // Kiểm tra Danh mục thuốc
        if (!category.value) {
            category.classList.add('is-invalid');
            isValid = false;
        }
        // Kiểm tra Liều lượng không rỗng
        if (!dosage.value.trim()) {
            dosage.classList.add('is-invalid');
            isValid = false;
        }
        // Kiểm tra Giờ uống thuốc
        if (!time.value) {
            time.classList.add('is-invalid');
            isValid = false;
        }
        // Kiểm tra URL ảnh bằng Regular Expression cơ bản (Bắt buộc bắt đầu bằng http:// hoặc https://)
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        if (!image.value.trim() || !urlPattern.test(image.value.trim())) {
            image.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
};