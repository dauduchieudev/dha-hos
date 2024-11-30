// Function để cập nhật các trường phòng khám và bác sĩ khi chọn khoa
async function updateSelections() {
    const departmentId = document.getElementById('department').value;

    // Cập nhật phòng khám
    await loadClinicRooms(departmentId);

    // Cập nhật bác sĩ
    await loadDoctors(departmentId);
}

// Function load phòng khám dựa trên khoa đã chọn
async function loadClinicRooms(departmentId) {
    const clinicRoomSelect = document.getElementById('clinicRoom');
    
    if (!departmentId) {
        clinicRoomSelect.innerHTML = '<option value="">-- Select Clinic Room --</option>';
        clinicRoomSelect.disabled = true;
        return;
    }

    clinicRoomSelect.disabled = false;

    try {
        const response = await fetch(`/admin/schedule/rooms/${departmentId}`);
        const clinicRooms = await response.json();

        clinicRoomSelect.innerHTML = '<option value="">-- Select Clinic Room --</option>'; // Reset options

        clinicRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.clinicRoom_id;
            option.textContent = room.room_name;
            clinicRoomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching clinic rooms:', error);
    }
}

// Function load bác sĩ dựa trên khoa đã chọn
async function loadDoctors(departmentId) {
    const doctorSelect = document.getElementById('doctor');
    
    if (!departmentId) {
        doctorSelect.innerHTML = '<option value="">-- Select Doctor --</option>';
        doctorSelect.disabled = true;
        return;
    }

    doctorSelect.disabled = false;

    try {
        const response = await fetch(`/admin/schedule/doctors/${departmentId}`);
        const doctors = await response.json();

        doctorSelect.innerHTML = '<option value="">-- Select Doctor --</option>';  // Reset options

        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctor_id; // Chọn doctor_id là giá trị gửi đi
            option.textContent = `${doctor.User.user_name} - ${doctor.User.full_name}`; // Hiển thị tên bác sĩ và username
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}
