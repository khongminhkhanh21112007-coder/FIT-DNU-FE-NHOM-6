// js/admin.js

$(document).ready(function () {
    const medModal = new bootstrap.Modal(document.getElementById('medicationModal'));
    let isEditMode = false;

    // Khai báo các biến lưu trữ toàn cục trong file để các hàm đều dùng chung được
    let medications = [];
    let patients = [];
    let schedules = [];

    // Định nghĩa thêm hàm xóa bệnh nhân vào API (phòng trường hợp api.js của bạn thiếu)
    if (!API.deletePatient) {
        API.deletePatient = (id) => fetch(`${API_BASE_1}/patients/${id}`, { method: 'DELETE' }).then(res => res.json());
    }

    // Định nghĩa thêm hàm xóa lịch nhắc vào API (phòng trường hợp api.js của bạn thiếu)
    if (!API.deleteSchedule) {
        API.deleteSchedule = (id) => fetch(`${API_BASE_1}/schedules/${id}`, { method: 'DELETE' }).then(res => res.json());
    }

    async function loadAdminData() {
        $('#medicationTableBody').html('<tr><td colspan="5" class="text-center py-2">Đang tải...</td></tr>');
        $('#patientTableBody').html('<tr><td colspan="4" class="text-center py-2">Đang tải...</td></tr>');
        $('#historyLogTableBody').html('<tr><td colspan="8" class="text-center py-2">Đang tải lịch sử...</td></tr>');
        
        try {
            // TẢI ĐỒNG THỜI CẢ 3 NGUỒN DỮ LIỆU bao gồm cả lịch nhắc uống thuốc (Schedules)
            const [medData, patientData, scheduleData] = await Promise.all([
                API.getMedications(),
                API.getPatients(),
                API.getSchedules()
            ]);

            // Gán dữ liệu nhận được vào các biến toàn cục bên trên
            medications = medData || [];
            patients = patientData || [];
            schedules = scheduleData || [];

            // Thực hiện render giao diện cho các bảng dữ liệu tương ứng
            renderMedicationTable(medications);
            renderPatientTable(patients);
            populateDropdowns(medications, patients);
            renderHistoryLog(); // <--- KÍCH HOẠT VẼ BẢNG LỊCH SỬ KHI TẢI XONG DATA
            
        } catch (e) {
            console.error("Lỗi đồng bộ:", e);
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

    // Sự kiện Thêm Bệnh nhân mới bằng Prompt nhanh
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
            const created = await API.createPatient(newPatient);
            if (created) {
                Utils.showToast(`Đã thêm thành công bệnh nhân: ${nameCleaned}`);
                loadAdminData(); // Tải lại toàn bộ để đồng bộ danh sách và cả ô Dropdown chọn bệnh nhân
            }
        } catch (err) {
            console.error("Lỗi API:", err);
            alert("Lỗi không thể lưu bệnh nhân lên MockAPI.");
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

    // Hàm hiển thị Lịch sử uống thuốc (Log Lịch trình xuống bảng dưới cùng)
    function renderHistoryLog() {
        const tbody = $('#historyLogTableBody').empty();

        // Nếu mảng rỗng hoặc chưa load được, thông báo trống
        if (!schedules || schedules.length === 0) {
            tbody.html('<tr><td colspan="8" class="text-muted py-4">Chưa có lịch sử ghi nhận nào trên hệ thống.</td></tr>');
            return;
        }

        // Sắp xếp lịch sử uống thuốc theo ngày và giờ mới nhất lên đầu để dễ theo dõi
        const sortedSchedules = [...schedules].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB - dateA;
        });

        sortedSchedules.forEach(item => {
            // Khớp ID bệnh nhân một cách an toàn
            const patient = patients.find(p => {
                const pId = p.id || p._id || "";
                const itemPtId = item.patientId || "";
                return pId.toString().trim() === itemPtId.toString().trim();
            }) || { name: "Bệnh nhân ẩn danh" };

            // Khớp ID tên thuốc một cách an toàn
            const med = medications.find(m => {
                const mId = m.id || m._id || "";
                const itemMedId = item.medicationId || "";
                return mId.toString().trim() === itemMedId.toString().trim();
            }) || { name: "Thuốc chưa rõ", dosage: "Theo đơn" };

            // Chuẩn hóa ngày thành định dạng DD/MM/YYYY của Việt Nam
            let displayDate = item.date;
            if (item.date && item.date.includes('-')) {
                displayDate = item.date.split('-').reverse().join('/');
            }

            // Lấy ID an toàn của hàng lịch trình
            const safeScheduleId = item.id || item._id;

            // Thiết kế thẻ trạng thái hỗ trợ bấm chuyển đổi tương tác (Thêm class, data, style cursor)
            const statusBadge = item.taken 
                ? `<span class="badge bg-success px-3 py-2 btn-toggle-status-admin" data-id="${safeScheduleId}" data-taken="true" style="font-size: 0.85rem; border-radius: 20px; cursor: pointer;" title="Bấm để đổi thành Chưa uống">✓ Đã uống</span>` 
                : `<span class="badge bg-warning text-dark px-3 py-2 btn-toggle-status-admin" data-id="${safeScheduleId}" data-taken="false" style="font-size: 0.85rem; border-radius: 20px; cursor: pointer;" title="Bấm để đổi thành Đã uống">⏳ Chưa uống</span>`;

            // Thêm cột dấu ❌ vào cuối dòng để thực hiện tính năng xóa lịch nhắc
            tbody.append(`
                <tr>
                    <td class="fw-bold text-secondary">${displayDate}</td>
                    <td class="fw-bold text-dark">⏰ ${item.time}</td>
                    <td class="fw-bold text-primary text-start ps-4">👤 ${patient.name}</td>
                    <td class="text-start ps-3 fw-semibold">💊 ${med.name}</td>
                    <td><span class="badge bg-light text-dark border">${med.dosage}</span></td>
                    <td class="text-muted text-start"><i>${item.note || '-'}</i></td>
                    <td>${statusBadge}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-link text-danger p-0 btn-delete-schedule" data-id="${safeScheduleId}" style="font-size: 1.05rem; text-decoration: none;" title="Xóa lịch nhắc này">
                            ❌
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    // Sự kiện Click đảo trạng thái uống thuốc trực tiếp trên bảng Admin
    $(document).on('click', '.btn-toggle-status-admin', async function () {
        const badge = $(this);
        const id = badge.data('id');
        const currentTaken = badge.data('taken') === true;
        const newTakenStatus = !currentTaken; // Đảo trạng thái

        try {
            // 1. Gửi lệnh cập nhật trạng thái mới lên server
            const updated = await API.updateSchedule(id, { taken: newTakenStatus });
            
            if (updated) {
                // 2. Tìm và cập nhật lại trạng thái ngay trong mảng bộ nhớ cục bộ
                const targetIndex = schedules.findIndex(s => (s.id || s._id).toString() === id.toString());
                if (targetIndex !== -1) {
                    schedules[targetIndex].taken = newTakenStatus;
                }

                // 3. Render lại bảng lịch sử để cập nhật màu sắc huy hiệu lập tức
                renderHistoryLog();
                Utils.showToast("Đã cập nhật trạng thái uống thuốc!");
            }
        } catch (err) {
            console.error("Lỗi khi đổi trạng thái:", err);
            Utils.showToast("Không thể cập nhật trạng thái.", "danger");
        }
    });

    // Sự kiện Bấm nút ❌ để xóa lịch nhắc uống thuốc
    $(document).on('click', '.btn-delete-schedule', async function () {
        const id = $(this).data('id');
        
        if (confirm("Bạn có chắc chắn muốn xóa lịch nhắc uống thuốc này không?\nDữ liệu tương ứng trên trang chủ cũng sẽ mất theo.")) {
            try {
                // 1. Gửi lệnh xóa lên MockAPI server
                await API.deleteSchedule(id);
                
                // 2. Lọc bỏ phần tử vừa xóa ra khỏi mảng cục bộ
                schedules = schedules.filter(s => (s.id || s._id).toString() !== id.toString());
                
                // 3. Vẽ lại bảng dữ liệu lập tức mà không cần load lại trang web
                renderHistoryLog();
                Utils.showToast("Đã xóa lịch nhắc thành công!");
            } catch (err) {
                console.error("Lỗi khi xóa lịch nhắc:", err);
                Utils.showToast("Không thể xóa lịch nhắc thuốc.", "danger");
            }
        }
    });

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

    // Tạo lịch nhắc nhở 
    $('#scheduleForm').submit(async function (e) {
        e.preventDefault();
        const arr = $(this).serializeArray();
        let scheduleData = { taken: false };
        arr.forEach(f => scheduleData[f.name] = String(f.value));

        try {
            const created = await API.createSchedule(scheduleData);
            if (created) {
                Utils.showToast("Tạo lịch nhắc nhở thành công!");
                $('#scheduleForm')[0].reset();
                
                // Đẩy trực tiếp bản ghi mới vào mảng để bảng tự động tăng dòng tức thì
                schedules.push(created);
                renderHistoryLog(); // Vẽ lại lịch sử ngay không cần tải lại toàn bộ trang
            }
        } catch (err) {
            Utils.showToast("Lỗi khi tạo lịch nhắc.", "danger");
        }
    });

    // CHẠY LẦN ĐẦU TIÊN KHI MỞ TRANG
    loadAdminData();
});