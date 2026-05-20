$(document).ready(function () {
    // Biến lưu trữ trạng thái trang và chế độ sửa
    let isEditMode = false;

    // Sự kiện khi Submit Form (Lưu lịch nhắc)
    $('#medication-form').on('submit', function (e) {
        e.preventDefault();
        
        // Kích hoạt Validation bằng cách kiểm tra các ô nhập liệu
        let isValid = true;
        
        if ($('#med-name').val().trim() === '') {
            $('#med-name').addClass('is-invalid');
            isValid = false;
        } else {
            $('#med-name').removeClass('is-invalid');
        }

        if ($('#med-category').val() === '') {
            $('#med-category').addClass('is-invalid');
            isValid = false;
        } else {
            $('#med-category').removeClass('is-invalid');
        }

        if (isValid) {
            // Xử lý gọi API Thêm/Sửa ở đây (Tùy thuộc vào file api.js của bạn)
            showToast("Lưu lịch nhắc thành công!");
            resetForm();
        }
    });

    // Hàm chuyển sang chế độ Sửa Thuốc (Đổi màu nút sang Warning)
    window.openEditMode = function(id) {
        isEditMode = true;
        $('#form-card-title').html('<i class="fa-solid fa-pen-to-square me-2"></i>Cập Nhật Lịch Nhắc');
        $('#btn-submit-form').removeClass('btn-success').addClass('btn-warning').html('<i class="fa-solid fa-save me-1"></i>Cập nhật');
        $('#btn-cancel-edit').removeClass('d-none');
        // Đổ dữ liệu từ hàng vào form...
    };

    // Hàm hủy bỏ chế độ sửa, quay về Thêm mới
    $('#btn-cancel-edit').on('click', function() {
        resetForm();
    });

    function resetForm() {
        isEditMode = false;
        $('#medication-form')[0].reset();
        $('.form-control, .form-select').removeClass('is-invalid');
        $('#form-card-title').html('<i class="fa-solid fa-file-medical me-2"></i>Thêm Lịch Nhắc Mới');
        $('#btn-submit-form').removeClass('btn-warning').addClass('btn-success').html('<i class="fa-solid fa-plus me-1"></i>Lưu lịch nhắc');
        $('#btn-cancel-edit').addClass('d-none');
    }

    function showToast(message) {
        $('#admin-toast-message').text(message);
        let toast = new bootstrap.Toast(document.getElementById('adminToast'));
        toast.show();
    }
});