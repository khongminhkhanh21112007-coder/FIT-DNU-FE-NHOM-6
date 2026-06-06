// js/utils.js

const Utils = {
    // Validate Form Thêm/Sửa Thuốc (Medication)
    validateMedicationForm: (data) => {
        let errors = {};
        if (!data.name || data.name.trim() === "") errors.name = "Tên thuốc không được để trống.";
        if (!data.dosage || data.dosage.trim() === "") errors.dosage = "Liều dùng không được để trống (Ví dụ: 1 viên, 5ml).";
        if (!data.doctor || data.doctor.trim() === "") errors.doctor = "Tên bác sĩ kê đơn không được để trống.";
        return errors;
    },

    // Hiển thị thông báo lỗi ngay dưới ô nhập liệu (Inline Error)
    showInlineErrors: (errors, formElement) => {
        $(formElement).find('.invalid-feedback').remove();
        $(formElement).find('.is-invalid').removeClass('is-invalid');

        Object.keys(errors).forEach(key => {
            const input = $(formElement).find(`[name="${key}"]`);
            input.addClass('is-invalid');
            input.after(`<div class="invalid-feedback">${errors[key]}</div>`);
        });
    },

    // Thông báo Toast góc màn hình (Bootstrap 5)
    showToast: (message, type = 'success') => {
        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-teal text-white' : 'bg-danger text-white';
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 m-3 shadow" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body fw-bold">💊 ${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`;
        $('.toast-container').append(toastHTML);
        const toastElement = new bootstrap.Toast(document.getElementById(toastId), { delay: 3000 });
        toastElement.show();
        $(`#${toastId}`).on('hidden.bs.toast', function () { $(this).remove(); });
    }
};