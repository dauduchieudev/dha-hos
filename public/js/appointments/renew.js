document.addEventListener("DOMContentLoaded", () => {
    const reappointmentButtons = document.querySelectorAll(".reappointment-button");

    reappointmentButtons.forEach(button => {
        button.addEventListener("click", () => {
            const appointmentId = button.dataset.appointmentId;

            // Gửi request đến server để lấy form tái khám
            fetch(`/appointment/renew/${appointmentId}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Không thể tải dữ liệu tái khám");
                })
                .then(data => {
                    // Hiển thị form tái khám
                    const formContainer = document.querySelector(".content");
                    formContainer.innerHTML = data.html;

                    // Sau khi form tái khám được render, xử lý các logic tiếp theo
                    setupFormEventListeners();
                })
                .catch(error => {
                    console.error("Lỗi khi tải form tái khám:", error);
                    alert("Không thể tải form tái khám, vui lòng thử lại.");
                });
        });
    });
});

function setupFormEventListeners() {
    const departmentField = document.getElementById('department');
    const clinicSelect = document.getElementById('clinic');
    const dateField = document.getElementById('date');
    const periodField = document.getElementById('period');
    const doctorSelect = document.getElementById('doctor');
    const form = document.querySelector('.appointment-form');

    // Lấy danh sách clinic rooms khi form tái khám được hiển thị
    if (departmentField) {
        const departmentId = departmentField.value;
        if (departmentId) {
            fetch(`/appointment/new/get-clinics?department_id=${departmentId}`)
                .then(response => {
                    if (!response.ok) throw new Error("Không thể tải danh sách phòng khám");
                    return response.json();
                })
                .then(result => {
                    clinicSelect.innerHTML = '<option value="">Chọn phòng khám</option>';
                    if (result.clinics && result.clinics.length > 0) {
                        result.clinics.forEach(clinic => {
                            const option = document.createElement('option');
                            option.value = clinic.id;
                            option.textContent = clinic.name;
                            clinicSelect.appendChild(option);
                        });
                    } else {
                        clinicSelect.innerHTML = '<option value="">Không có phòng khám nào</option>';
                    }
                })
                .catch(error => {
                    console.error("Error fetching clinics:", error);
                });
        }
    }

    // Gắn sự kiện thay đổi cho các trường clinic, date, period
    if (clinicSelect) clinicSelect.addEventListener('change', fetchDoctors);
    if (dateField) dateField.addEventListener('change', fetchDoctors);
    if (periodField) periodField.addEventListener('change', fetchDoctors);

    form.addEventListener('submit', function (event) {
        const descriptionValue = document.getElementById('description').value;
        const clinicValue = clinicSelect.value;
        const dateValue = dateField.value;
        const periodValue = periodField.value;
        const doctorValue = doctorSelect.value;

        // Kiểm tra xem các trường quan trọng đã được điền chưa
        if (!descriptionValue.trim() || !clinicValue || !dateValue || !periodValue || !doctorValue) {
            event.preventDefault(); 

            alert("Vui lòng nhập đầy đủ thông tin");
            return; 
        }

        document.getElementById('hidden-description').value = descriptionValue;
    });
}

// Gửi yêu cầu lấy bác sĩ phù hợp khi chọn khoa, ngày, buổi
async function fetchDoctors() {
    const department = document.getElementById('department')?.value;
    const clinicRoom = document.getElementById('clinic')?.value;
    const date = document.getElementById('date')?.value;
    const period = document.getElementById('period')?.value;

    if (department && clinicRoom && date && period) {
        try {
            const response = await fetch('/appointment/new/get-available-doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, shift_period_id: period, clinicRoom_id: clinicRoom }),
            });

            if (!response.ok) throw new Error("Không thể tải danh sách bác sĩ");

            const result = await response.json();

            const doctorSelect = document.getElementById('doctor');
            doctorSelect.innerHTML = '<option value="">Chọn bác sĩ</option>'

            if (result.doctors && result.doctors.length > 0) {
                result.doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = doctor.full_name;
                    doctorSelect.appendChild(option);
                });
            } else {
                doctorSelect.innerHTML = '<option value="">Không có bác sĩ phù hợp</option>';
            }
        } catch (err) {
            console.error("Error fetching doctors:", err);
        }
    }
}
