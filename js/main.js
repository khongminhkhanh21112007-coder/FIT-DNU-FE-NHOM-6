// js/main.js

$(document).ready(function () {
    let schedules = [];
    let patients = [];
    let medications = [];

    const todayStr = new Date().toISOString().split('T')[0];
    $('#filterDate').val(todayStr);

    // Đảm bảo hàm DELETE được định nghĩa đúng với link API schedules của bạn
    if (!API.deleteSchedule) {
        const API_SCHEDULES = "https://6a0f15081736097c360b1d5e.mockapi.io/api/v1";
        API.deleteSchedule = (id) => fetch(`${API_SCHEDULES}/schedules/${id}`, { method: 'DELETE' }).then(res => res.json());
    }

    function normalizeDate(dateStr) {
        if (!dateStr) return "";
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr;
    }

    async function initPage() {
        $('#loading').show();
        $('#scheduleList').hide();

        try {
            const [dataSchedules, dataPatients, dataMedications] = await Promise.all([
                API.getSchedules().catch(() => []),
                API.getPatients().catch(() => []),
                API.getMedications().catch(() => [])
            ]);

            schedules = dataSchedules || [];
            patients = dataPatients || [];
            medications = dataMedications || [];
        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu:", error);
        } finally {
            $('#loading').hide();
            $('#scheduleList').fadeIn(200);
            renderSchedules();
        }
    }

    function renderSchedules() {
        const container = $('#scheduleList').empty();
        const selectedDate = $('#filterDate').val();
        const searchName = $('#searchPatient').val().toLowerCase().trim();
        const filterStatus = $('#filterStatus').val();

        if (selectedDate === todayStr) {
            $('#scheduleTitle').text("📅 Danh Sách Nhắc Nhở Hôm Nay");
        } else {
            const formattedDate = selectedDate.split('-').reverse().join('/');
            $('#scheduleTitle').text(`📅 Lịch Sử Nhắc Nhở Ngày ${formattedDate}`);
        }

        if (!schedules || schedules.length === 0) {
            container.html('<div class="col-12 text-center text-muted my-4">Chưa có lịch nhắc nhở nào.</div>');
            return;
        }

        const filtered = schedules.filter(item => {
            const p = patients.find(pt => String(pt.id || pt._id || "").trim() === String(item.patientId || "").trim()) || { name: "" };
            const matchesDate = normalizeDate(item.date) === selectedDate;
            const matchesSearch = p.name.toLowerCase().includes(searchName);
            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'taken' && item.taken) || 
                (filterStatus === 'pending' && !item.taken);
            return matchesDate && matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            container.html('<div class="col-12 text-center text-muted my-4">Không có lịch uống thuốc nào phù hợp.</div>');
            return;
        }

        filtered.forEach(item => {
            // So khớp id chặt chẽ để lấy thông tin Patient và Medication từ API_BASE_1
            const patient = patients.find(p => String(p.id || p._id || "").trim() === String(item.patientId || "").trim()) || { name: "Bệnh nhân ẩn danh" };
            const med = medications.find(m => String(m.id || m._id || "").trim() === String(item.medicationId || "").trim()) || { name: "Thuốc chưa rõ", dosage: "Theo đơn", doctor: "N/A" };
            const safeId = item.id || item._id;

            // Xác định màu sắc giao diện dựa theo trạng thái (Xanh lá / Vàng nhạt)
            const cardClass = item.taken ? 'border-success bg-light-success' : 'border-warning bg-light-warning';
            const badgeClass = item.taken ? 'bg-success text-white' : 'bg-warning text-dark';

            container.append(`
                <div class="col">
                    <div class="card h-100 border shadow-sm card-med ${cardClass}" data-id="${safeId}" data-taken="${item.taken}" style="border-width: 2px !important; transition: all 0.2s;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge ${badgeClass} btn-toggle-status" style="cursor:pointer; font-size: 0.85rem; padding: 6px 10px;">
                                    ${item.taken ? '✓ Đã uống' : '⏳ Chưa uống'}
                                </span>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold text-dark" style="font-size: 1.05rem;">⏰ ${item.time}</span>
                                    <button class="btn btn-sm btn-danger btn-delete-schedule px-2 py-0" data-id="${safeId}" style="font-size: 0.75rem; border-radius: 4px;">✕ Xóa</button>
                                </div>
                            </div>
                            <h5 class="card-title fw-bold text-primary mb-2" style="text-decoration: none !important;">👤 ${patient.name}</h5>
                            <hr class="my-2 opacity-50">
                            <p class="mb-1 text-dark"><strong>💊 Thuốc:</strong> ${med.name}</p>
                            <p class="mb-1 text-dark"><strong>⚖️ Liều dùng:</strong> ${med.dosage}</p>
                            <p class="mb-0 text-muted"><small>👨‍⚕️ Bác sĩ: ${med.doctor}</small></p>
                            ${item.note ? `<p class="mb-0 text-muted mt-2 small bg-white p-1 rounded border">📋 Ghi chú: <i>${item.note}</i></p>` : ''}
                        </div>
                    </div>
                </div>`);
        });
    }

    // Sự kiện click badge chuyển trạng thái (Đã uống / Chưa uống)
    $(document).on('click', '.btn-toggle-status', async function (e) {
        e.stopPropagation();
        const card = $(this).closest('.card-med');
        const id = card.data('id');
        const currentTaken = card.data('taken') === true;
        const newTaken = !currentTaken;

        try {
            await API.updateSchedule(id, { taken: newTaken });
            const target = schedules.find(s => String(s.id || s._id) === String(id));
            if (target) target.taken = newTaken;
            renderSchedules();
        } catch (e) {
            Utils.showToast("Không thể cập nhật trạng thái.", "danger");
        }
    });

    // Sự kiện click nút Xóa lịch nhắc nhở
    $(document).on('click', '.btn-delete-schedule', async function (e) {
        e.stopPropagation();
        const id = $(this).data('id');
        if (confirm("Bạn chắc chắn muốn xóa lịch nhắc nhở này khỏi hệ thống?")) {
            try {
                await API.deleteSchedule(id);
                Utils.showToast("Đã xóa lịch nhắc thành công!");
                schedules = schedules.filter(s => String(s.id || s._id) !== String(id));
                renderSchedules();
            } catch (err) {
                Utils.showToast("Không thể xóa lịch trình lúc này.", "danger");
            }
        }
    });

    $('#filterDate, #filterStatus').on('change', renderSchedules);
    $('#searchPatient').on('input', renderSchedules);

    initPage();
});