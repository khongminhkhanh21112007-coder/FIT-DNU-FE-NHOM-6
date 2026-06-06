// js/api.js

// Link 1: Quản lý bệnh nhân (patients) và danh mục thuốc (medications)
const API_BASE_1 = "https://6a0f13901736097c360b1af6.mockapi.io/api/v1"; 

// Link 2: Quản lý lịch nhắc nhở uống thuốc (schedules) - ĐÃ SỬA CHUẨN XÁC ĐƯỜNG DẪN
const API_SCHEDULES = "https://6a0f15081736097c360b1d5e.mockapi.io/api/v1"; 

const API = {
    // ---------------- QUẢN LÝ BỆNH NHÂN (Dùng link 1) ----------------
    getPatients: () => fetch(`${API_BASE_1}/patients`)
        .then(res => {
            if (!res.ok) throw new Error("Lỗi tải danh sách bệnh nhân");
            return res.json();
        }),

    createPatient: (data) => fetch(`${API_BASE_1}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    deletePatient: (id) => fetch(`${API_BASE_1}/patients/${id}`, { 
        method: 'DELETE' 
    }).then(res => res.json()),


    // ---------------- QUẢN LÝ THUỐC (Dùng link 1) ----------------
    getMedications: () => fetch(`${API_BASE_1}/medications`)
        .then(res => {
            if (!res.ok) throw new Error("Lỗi tải danh mục thuốc");
            return res.json();
        }),

    getMedicationById: (id) => fetch(`${API_BASE_1}/medications/${id}`)
        .then(res => res.json()),

    createMedication: (data) => fetch(`${API_BASE_1}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    updateMedication: (id, data) => fetch(`${API_BASE_1}/medications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    deleteMedication: (id) => fetch(`${API_BASE_1}/medications/${id}`, { 
        method: 'DELETE' 
    }).then(res => res.json()),


    // ---------------- QUẢN LÝ LỊCH NHẮC (Dùng link riêng biệt) ----------------
    getSchedules: () => fetch(`${API_SCHEDULES}/schedules`)
        .then(res => {
            if (!res.ok) throw new Error("Lỗi tải lịch nhắc nhở");
            return res.json();
        }),

    createSchedule: (data) => fetch(`${API_SCHEDULES}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    updateSchedule: (id, data) => fetch(`${API_SCHEDULES}/schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    deleteSchedule: (id) => fetch(`${API_SCHEDULES}/schedules/${id}`, { 
        method: 'DELETE' 
    }).then(res => res.json())
};