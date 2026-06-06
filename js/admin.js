// js/admin.js

$(document).ready(function () {
    const medModal = new bootstrap.Modal(document.getElementById('medicationModal'));
    let isEditMode = false;

    // Định nghĩa thêm hàm xóa bệnh nhân vào API (phòng trường hợp api.js của bạn thiếu)
    if (!API.deletePatient) {
        API.deletePatient = (id) => fetch(`${API_BASE_1}/patients/${id}`, { method: 'DELETE' }).then(res => res.json());
    }

    async function loadAdminData() {
        $('#medicationTableBody').html('<tr><td colspan="5" class="text-center py-2">Đang tải...</td></tr>');
        $('#patientTableBody').html('<tr><td colspan="4" class="text-center py-2">Đang tải...</td></tr>');
        try {
            const [medications, patients] = await Promise.all([
                API.getMedications(),
                API.getPatients()
            ]);

            renderMedicationTable(medications);
            renderPatientTable(patients);
            populateDropdowns(medications, patients);
        } catch (e) {
            Utils.showToast("Lỗi đồng bộ dữ liệu MockAPI.", "danger");
        }
    }

    function renderMedicationTable(meds) {
        const tbody = $('#medicationTableBody').empty();
        if (!meds || meds.length === 0) {
            tbody.html('<tr><td colspan="5" class="text-center text-muted py-2">Trống</td></tr>');
            return;
        }
        meds.forEach(m => {
            const safeId = m.id || m._id || "N/A";
            tbody.append(`
                <tr>
                    <td><code class="text-pink fw-bold">MS-${safeId}</code></td>
                    <td class="fw-bold text-dark-blue">${m.name || ""}</td>
                    <td>${m.dosage || ""}</td>
                    <td>BS. ${m.doctor || ""}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-edit-med me-1" data-id="${safeId}">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete-med" data-id="${safeId}">Xóa</button>
                    </td>
                </tr>`);
        });
    }

    // Hàm hiển thị danh sách bệnh nhân và NÚT XÓA BỆNH NHÂN
    function renderPatientTable(patientsList) {
        const tbody = $('#patientTableBody').empty();
        if (!patientsList || patientsList.length === 0) {
            tbody.html('<tr><td colspan="4" class="text-center text-muted py-2">Chưa có bệnh nhân nào</td></tr>');
            return;
        }
        patientsList.forEach(p => {
            const safeId = p.id || p._id || "N/A";
            tbody.append(`
                <tr>
                    <td><code>BN-${safeId}</code></td>
                    <td class="fw-bold text-secondary">${p.name || ""}</td>
                    <td><span class="badge bg-info text-dark">${p.disease || "Chưa cập nhật"}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-danger btn-delete-patient" data-id="${safeId}">Xóa BN</button>
                    </td>
                </tr>`);
        });
    }
    // Dán đoạn code này vào bên trong để xử lý nút bấm:
    // Tìm đến đúng đoạn này trong file js/admin.js của bạn và thay thế toàn bộ cụm sự kiện này:
$('#btnOpenAddPatient').on('click', async function () {
    const nameInput = prompt("Nhập họ và tên bệnh nhân mới:");
    if (nameInput === null) return; 
    
    const nameCleaned = nameInput.trim();
    if (!nameCleaned) {
        alert("Tên bệnh nhân không được bỏ trống!");
        return;
    }

    const diseaseInput = prompt(`Nhập bệnh lý / chẩn đoán cho bệnh nhân "${nameCleaned}":`);
    if (diseaseInput === null) return;
    const diseaseCleaned = diseaseInput.trim() || "Chưa rõ";

    const newPatient = {
        name: nameCleaned,
        disease: diseaseCleaned,
        gender: "N/A",
        phone: "N/A",
        address: "N/A",
        createdAt: new Date().toISOString()
    };

    try {
        // 1. Gửi dữ liệu lên MockAPI để lưu trữ lâu dài
        const created = await API.createPatient(newPatient);
        
        if (created) {
            // 2. Thêm trực tiếp người vừa tạo vào mảng dữ liệu hiện tại trong bộ nhớ
            if (typeof patients !== 'undefined' && Array.isArray(patients)) {
                patients.push(created);
            }
            
            // 3. Gọi hàm hiển thị lại bảng bệnh nhân ngay lập tức mà không cần reload trang
            if (typeof renderPatients === "function") {
                renderPatients();
            } else if (typeof renderPatientTable === "function") {
                renderPatientTable(patients);
            } else {
                // Phương án dự phòng nếu hàm render của bạn tên khác
                location.reload(); 
                return;
            }

            // 4. Đồng bộ lại danh sách lựa chọn (Select/Option) ở ô tạo lịch nhắc uống thuốc
            if (typeof updateSelectOptions === "function") {
                updateSelectOptions();
            }

            alert(`Đã thêm thành công bệnh nhân: ${nameCleaned}`);
        }
    } catch (err) {
        console.error("Lỗi API:", err);
        alert("Lỗi không thể lưu bệnh nhân lên MockAPI. Bạn hãy thử kiểm tra lại kết nối mạng.");
    }
});
    function populateDropdowns(meds, patientsList) {
        const selectMed = $('#selectMedication').empty();
        const selectPat = $('#selectPatient').empty();

        if (patientsList && patientsList.length > 0) {
            patientsList.forEach(p => {
                const safeId = p.id || p._id || "N/A";
                selectPat.append(`<option value="${safeId}">${p.name} (BN-${safeId})</option>`);
            });
        } else {
            selectPat.append('<option value="">-- Không có bệnh nhân --</option>');
        }

        if (meds && meds.length > 0) {
            meds.forEach(m => {
                const safeId = m.id || m._id || "N/A";
                selectMed.append(`<option value="${safeId}">${m.name}</option>`);
            });
        } else {
            selectMed.append('<option value="">-- Không có thuốc --</option>');
        }
    }

    // Sự kiện Xóa Bệnh Nhân
    $(document).on('click', '.btn-delete-patient', async function () {
        const id = $(this).data('id');
        if (confirm(`Bạn có chắc chắn muốn xóa bệnh nhân BN-${id} này không?`)) {
            try {
                await API.deletePatient(id);
                Utils.showToast("Đã xóa bệnh nhân thành công.");
                loadAdminData();
            } catch (err) {
                Utils.showToast("Lỗi khi xóa bệnh nhân.", "danger");
            }
        }
    });

    // Các sự kiện quản lý Thuốc
    $('#btnOpenAddMed').click(function () {
        isEditMode = false;
        $('#medModalTitle').text('➕ Khai Báo Thuốc Mới');
        $('#medicationForm')[0].reset();
        $('#medIdField').val('');
        medModal.show();
    });

    $(document).on('click', '.btn-edit-med', async function () {
        const id = $(this).data('id');
        try {
            const med = await API.getMedicationById(id);
            isEditMode = true;
            $('#medModalTitle').text('✏️ Chỉnh Sửa Thuốc');
            $('#medIdField').val(med.id || med._id);
            $('input[name="name"]').val(med.name);
            $('input[name="dosage"]').val(med.dosage);
            $('input[name="doctor"]').val(med.doctor);
            medModal.show();
        } catch (e) {
            Utils.showToast("Lỗi tải thông tin thuốc.", "danger");
        }
    });

    $(document).on('click', '.btn-delete-med', async function () {
        const id = $(this).data('id');
        if (confirm("Xác nhận xóa thuốc?")) {
            try {
                await API.deleteMedication(id);
                Utils.showToast("Đã xóa thuốc.");
                loadAdminData();
            } catch (err) {
                Utils.showToast("Xóa thất bại.", "danger");
            }
        }
    });

    $('#medicationForm').submit(async function (e) {
        e.preventDefault();
        let formData = {
            name: $('input[name="name"]').val(),
            dosage: $('input[name="dosage"]').val(),
            doctor: $('input[name="doctor"]').val()
        };
        try {
            if (isEditMode) {
                await API.updateMedication($('#medIdField').val(), formData);
                Utils.showToast("Cập nhật thuốc thành công.");
            } else {
                await API.createMedication(formData);
                Utils.showToast("Thêm thuốc thành công.");
            }
            medModal.hide();
            loadAdminData();
        } catch (err) {
            Utils.showToast("Thao tác thất bại.", "danger");
        }
    });

    // Tạo lịch nhắc nhở (Đồng bộ ép chuỗi String cho ID)
    $('#scheduleForm').submit(async function (e) {
        e.preventDefault();
        const arr = $(this).serializeArray();
        let scheduleData = { taken: false };
        arr.forEach(f => scheduleData[f.name] = String(f.value)); // Ép id về chuỗi text đồng bộ

        try {
            await API.createSchedule(scheduleData);
            Utils.showToast("Tạo lịch nhắc nhở thành công!");
            $('#scheduleForm')[0].reset();
        } catch (err) {
            Utils.showToast("Lỗi khi tạo lịch nhắc.", "danger");
        }
    });

    loadAdminData();
});