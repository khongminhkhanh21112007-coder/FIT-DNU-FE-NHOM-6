// Sử dụng mô hình jQuery kết hợp JS thuần
$(document).ready(function() {
    let localMedications = []; // Lưu trữ danh sách thuốc cục bộ để tìm kiếm/lọc nhanh

    // Khởi chạy ứng dụng
    initPage();

    function initPage() {
        loadMedicationsData();
        
        // Gắn sự kiện tìm kiếm và bộ lọc bằng jQuery
        $('#search-input').on('input', filterAndRender);
        $('#category-filter').on('change', filterAndRender);
    }

    // Hàm 1: Gọi API lấy dữ liệu và ẩn/hiện Loading Spinner bằng jQuery Effect
    function loadMedicationsData() {
        $('#loading-spinner').show(); // jQuery Effect .show()
        $('#medication-list').hide(); // Ẩn danh sách tạm thời

        API.getAll()
            .then(data => {
                localMedications = data;
                renderMedications(localMedications);
            })
            .catch(err => {
                alert("Đã xảy ra lỗi hệ thống: " + err.message);
            })
            .finally(() => {
                $('#loading-spinner').hide(); // jQuery Effect .hide()
                $('#medication-list').fadeIn(600); // jQuery Effect .fadeIn()
            });
    }

    // Hàm 2: Xử lý và render cấu trúc HTML giao diện thẻ Card (Dùng JS thuần thao tác DOM)
    function renderMedications(list) {
        const listContainer = document.getElementById('medication-list');
        listContainer.innerHTML = '';

        if (list.length === 0) {
            listContainer.innerHTML = `<div class="col-12 text-center text-muted my-4">Không tìm thấy lịch uống thuốc nào tương thích.</div>`;
            return;
        }

        // Vòng lặp For...of (Cấu trúc điều khiển JavaScript thuần)
        for (let med of list) {
            const cardCol = document.createElement('div');
            cardCol.className = 'col-12 col-sm-6 col-md-4 col-lg-3'; // Responsive Grid Bootstrap 5
            
            // Kiểm tra trạng thái đã uống để phủ màu đặc biệt
            const takenClass = med.isTaken ? 'card-taken' : '';
            const statusBadge = med.isTaken 
                ? '<span class="badge bg-success"><i class="fa-solid fa-check me-1"></i>Đã uống</span>' 
                : '<span class="badge bg-danger"><i class="fa-solid fa-circle-exclamation me-1"></i>Chưa uống</span>';

            cardCol.innerHTML = `
                <div class="card h-100 shadow-sm med-card ${takenClass}" data-id="${med.id}">
                    <div class="med-img-container">
                        <img src="${med.image}" alt="${med.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-secondary text-wrap style="max-width: 120px">${med.category}</span>
                            <span class="text-primary fw-bold"><i class="fa-solid fa-clock me-1"></i>${med.time}</span>
                        </div>
                        <h5 class="card-title fw-bold med-title mb-1 text-truncate">${med.name}</h5>
                        <p class="card-text text-muted small mb-3">Liều dùng: <strong>${med.dosage}</strong></p>
                        
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            ${statusBadge}
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary btn-detail" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                                <button class="btn ${med.isTaken ? 'btn-success' : 'btn-outline-success'} btn-toggle-status" title="Đánh dấu trạng thái">
                                    <i class="fa-solid fa-square-check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Gắn sự kiện JS thuần xử lý hành vi của từng nút trong thẻ Card
            cardCol.querySelector('.btn-detail').addEventListener('click', () => showDetailModal(med));
            cardCol.querySelector('.btn-toggle-status').addEventListener('click', () => handleToggleTakenStatus(med));

            listContainer.appendChild(cardCol);
        }
    }

    // Hàm 3: Lọc dữ liệu mảng kết hợp điều kiện Tìm kiếm và Danh mục (Cấu trúc rẽ nhánh if/else)
    function filterAndRender() {
        const keyword = $('#search-input').val().toLowerCase().trim();
        const category = $('#category-filter').val();

        const filtered = localMedications.filter(med => {
            const matchesSearch = med.name.toLowerCase().includes(keyword);
            const matchesCategory = category === "" || med.category === category;
            return matchesSearch && matchesCategory;
        });

        renderMedications(filtered);
    }

    // Hàm 4: Hiển thị popup modal thông tin chi tiết (Thao tác DOM JS Thuần)
    function showDetailModal(med) {
        document.getElementById('modal-med-name').innerText = med.name;
        document.getElementById('modal-med-category').innerText = med.category;
        document.getElementById('modal-med-dosage').innerText = med.dosage;
        document.getElementById('modal-med-time').innerText = med.time;
        document.getElementById('modal-med-image').src = med.image;
        document.getElementById('modal-med-note').innerText = med.note || "Không có ghi chú nào thêm từ bác sĩ.";

        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    }

    // ⭐ Chức năng Ngôi Sao Đề Bài Yêu Cầu: Toggle trạng thái bằng API PUT trực tiếp
    function handleToggleTakenStatus(med) {
        // Đảo ngược trạng thái hiện tại
        const updatedStatus = !med.isTaken; 
        
        // Gọi API PUT cập nhật lên máy chủ MockAPI ngay lập tức
        API.update(med.id, { isTaken: updatedStatus })
            .then(updatedMed => {
                // Cập nhật lại vào mảng cục bộ để đồng bộ giao diện
                med.isTaken = updatedMed.isTaken;
                filterAndRender(); // Re-render mượt mà dữ liệu mới
                
                Utils.showToast('liveToast', 'toast-message', `Đã cập nhật trạng thái thuốc sang: ${updatedMed.isTaken ? 'ĐÃ UỐNG' : 'CHƯA UỐNG'}`);
            })
            .catch(err => {
                Utils.showToast('liveToast', 'toast-message', "Không thể cập nhật trạng thái: " + err.message, false);
            });
    }
});