async function showForm() {
    try {
        const response = await fetch('/appointment/new/random-department');
        const result = await response.json();

        // Hiển thị khoa được gợi ý
        document.querySelector('.result-api').innerText = `Bạn nên chọn khoa: ${result.department.department_name}`;

        // Đặt khoa mặc định
        const departmentSelect = document.getElementById('department');
        departmentSelect.value = result.department.department_id;

        // Cập nhật danh sách phòng khám
        const clinicSelect = document.getElementById('clinic');
        clinicSelect.innerHTML = '<option value="">Chọn phòng khám</option>';
        result.clinics.forEach(clinic => {
            const option = document.createElement('option');
            option.value = clinic.id;
            option.textContent = clinic.name;
            clinicSelect.appendChild(option);
        });

        // Hiển thị form
        document.getElementById('new-appointment-form').style.display = 'block';
    } catch (err) {
        console.error('Error fetching random department:', err);
    }
}

// Xử lý khi nhấn vào nút "Kết quả"
document.querySelector('.result-button').addEventListener('click', async function () {
    const descriptionValue = document.getElementById('description').value;

    if (!descriptionValue.trim()) {
        alert('Vui lòng nhập mô tả triệu chứng của bạn!');
        return;
    }

    document.getElementById('hidden-description').value = descriptionValue;

    await showForm();
});

// Xử lý khi nhấn vào nút "Kết quả"
const form = document.querySelector('#new-appointment-form');
form.addEventListener('submit', function (event) {
    const descriptionValue = document.getElementById('description').value;
    const clinicSelect = document.getElementById('clinic');
    const dateField = document.getElementById('new-date');
    const periodField = document.getElementById('period');
    const doctorSelect = document.getElementById('doctor');

    // Kiểm tra xem các trường quan trọng đã được điền chưa
    if (!descriptionValue.trim() || !clinicSelect.value || !dateField.value || !periodField.value || !doctorSelect.value) {
        event.preventDefault();
        alert("Vui lòng nhập đầy đủ thông tin");
        return; 
    }

    document.getElementById('hidden-description').value = descriptionValue;
});

// Lấy danh sách phòng khám theo khoa
async function fetchClinicsByDepartment() {
    const departmentId = document.getElementById('department').value;

    if (departmentId) {
        try {
            const response = await fetch(`/appointment/new/get-clinics?department_id=${departmentId}`);
            const result = await response.json();

            const clinicSelect = document.getElementById('clinic');
            clinicSelect.innerHTML = '<option value="">Chọn phòng khám</option>'; 

            if (result.clinics && result.clinics.length > 0) {
                result.clinics.forEach(clinic => {
                    const option = document.createElement('option');
                    option.value = clinic.id;
                    option.textContent = clinic.name;
                    clinicSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Không có phòng khám nào';
                clinicSelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    }
}

document.getElementById('department').addEventListener('change', fetchClinicsByDepartment);

// Gửi yêu cầu lấy bác sĩ phù hợp khi chọn khoa, ngày, buổi
async function fetchDoctors() {
    const department = document.getElementById('department').value;
    const clinicRoom = document.getElementById('clinic').value; 
    const date = document.getElementById('new-date').value;
    const period = document.getElementById('period').value;

    if (department && clinicRoom && date && period) {
        try {
            const response = await fetch('/appointment/new/get-available-doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, shift_period_id: period, clinicRoom_id: clinicRoom }),
            });
            const result = await response.json();

            // Xử lý danh sách bác sĩ
            const doctorSelect = document.getElementById('doctor');
            doctorSelect.innerHTML = ''; // Xóa danh sách hiện tại
            if (result.doctors && result.doctors.length > 0) {
                result.doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `${doctor.full_name}`;
                    doctorSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Không có bác sĩ phù hợp';
                doctorSelect.appendChild(option);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    }
}

// Lắng nghe sự kiện thay đổi
document.getElementById('department').addEventListener('change', fetchDoctors);
document.getElementById('new-date').addEventListener('change', fetchDoctors);
document.getElementById('period').addEventListener('change', fetchDoctors);
document.getElementById('clinic').addEventListener('change', fetchDoctors);