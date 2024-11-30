function toggleSection(sectionId) {
    // Lấy tất cả các section
    var sections = document.querySelectorAll('.section');
    
    // Ẩn tất cả các section
    sections.forEach(function(section) {
        section.style.display = 'none';
    });
    
    // Hiển thị section được chọn
    var section = document.getElementById(sectionId);
    section.style.display = 'block';

    const menuItems = document.querySelectorAll('.sidebar li');
    menuItems.forEach(item => item.classList.remove('active'));

    // Thêm class 'active' vào mục menu được chọn
    const activeItem = document.querySelector(`.sidebar li[onclick="toggleSection('${sectionId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Lưu section hiện tại vào localStorage
    localStorage.setItem('currentSection', sectionId);
}

function restoreSection() {
    var currentSection = localStorage.getItem('currentSection');
    if (currentSection) {
        toggleSection(currentSection); // Hiển thị lại section đã lưu
    } else {
        toggleSection('diagnosis-section'); // Mặc định quay lại section đầu tiên nếu không có section lưu
    }
}

// Gọi restoreSection khi trang tải lại
window.addEventListener('load', restoreSection);

document.querySelectorAll('.sidebar li').forEach(function(menuItem) {
    menuItem.addEventListener('click', function() {
        var sectionId = this.getAttribute('onclick').match(/'([^']+)'/)[1]; // Lấy ID của section
        toggleSection(sectionId);
    });
});

// Thêm test khám
function addTestResult() {
    // Hiển thị form nhập liệu
    document.getElementById("test-type-form").style.display = "block";
    
    // Gửi request để lấy danh sách Test_Types và Test_Indicators
    fetch('/doctor/get-test-types')
        .then(response => response.json())
        .then(data => {
            const testTypeSelect = document.getElementById("test_type");
            testTypeSelect.innerHTML = ''; // Xóa hết các option cũ

            // Thêm option mặc định nếu cần
            const defaultOption = document.createElement("option");
            defaultOption.value = "0";
            defaultOption.text = "Chọn loại xét nghiệm";
            testTypeSelect.appendChild(defaultOption);

            // Điền dữ liệu vào các select options
            data.testTypes.forEach(type => {
                const option = document.createElement("option");
                option.value = type.test_type_id;
                option.text = type.test_type_name;
                testTypeSelect.appendChild(option);
            });

            testTypeSelect.addEventListener('change', loadTestIndicators);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadTestIndicators() {
    const testTypeId = document.getElementById("test_type").value;

    // Gửi request để lấy các test indicators tương ứng với test_type_id
    fetch(`/doctor/get-test-indicators/${testTypeId}`)
        .then(response => response.json())
        .then(data => {
            const testIndicatorContainer = document.getElementById("test-indicator-container");

            document.getElementById("test-indicator-container").innerHTML = '';

            data.testIndicators.forEach(result => {
                const div = document.createElement("div");
                div.classList.add("test-indicator");

                // Tạo cấu trúc hiển thị cho mỗi chỉ số xét nghiệm
                div.innerHTML = `
                    <p>
                        <strong>${result.test_indicator_name}:</strong>
                        <input type="text" id="test_value_${result.test_indicator_id}" 
                               name="test_value_${result.test_indicator_id}" 
                               class="form-control" placeholder="Nhập kết quả" required>
                        <span>${result.unit}</span>
                    </p>
                    <p><strong>Ngưỡng trung bình:</strong> ${result.reference_range}</p>
                    <p>
                        <strong>Ghi chú:</strong>
                        <input id="comment_${result.test_indicator_id}" 
                                  name="comment_${result.test_indicator_id}" 
                                  class="form-control" placeholder="Nhập ghi chú cho kết quả xét nghiệm">
                        </input required>
                    </p>
                `;

                // Thêm vào container
                testIndicatorContainer.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addImageResult() {
    document.getElementById("new-image-result-form").style.display = "block";

    fetch('/doctor/get-imaging-types')
        .then(response => response.json())
        .then(data => {
            const imagingTypeSelect = document.getElementById("imaging_type");
            imagingTypeSelect.innerHTML = '';  // Clear existing options

            // Điền các loại hình ảnh vào select
            data.imagingTypes.forEach(type => {
                const option = document.createElement("option");
                option.value = type.imaging_type_id;
                option.textContent = type.imaging_type_name;
                imagingTypeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching imaging types:', error);
        });
}

// Thêm đơn thuốc
let medications = [];

function addPrescription() {
    document.getElementById("new-prescription-form").style.display = "block";

    fetch('/doctor/get-medications')
        .then(response => response.json())
        .then(data => {
            medications = data.medications;
        })
        .catch(error => {
            console.error("Error fetching medications:", error);
        });
}

function handleMedicationInput(event) {
    const query = event.target.value.toLowerCase();
    const suggestionsList = document.getElementById("medication-suggestions");
    suggestionsList.innerHTML = '';

    if (query.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    const filteredMedications = medications.filter(medication => 
        medication.medication_name.toLowerCase().includes(query)
    );

    if (filteredMedications.length > 0) {
        suggestionsList.style.display = 'block';  
    } else {
        suggestionsList.style.display = 'none';
    }

    filteredMedications.forEach(medication => {
        const li = document.createElement("li");
        li.textContent = medication.medication_name;
        li.onclick = () => selectMedication(medication);  
        suggestionsList.appendChild(li);
    });
}

function selectMedication(medication) {
    document.getElementById("medication").value = medication.medication_name;
    document.getElementById("medication_id").value = medication.medication_id;  
    document.getElementById("unit").value = medication.unit;  
    document.getElementById("medication-suggestions").style.display = 'none';  
}

// Gọi hàm tải thuốc khi trang được tải và lắng nghe sự kiện input
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("add-prescription-btn").addEventListener('click', addPrescription);
    document.getElementById("medication").addEventListener('input', handleMedicationInput); 
});

function deleteImageResult(imageResultId) {
    if (confirm("Bạn có chắc chắn muốn xóa kết quả chụp chiếu này?")) {
        fetch(`/doctor/delete-image-result`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageResultId: imageResultId 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể xóa kết quả hình ảnh');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || "Đã xóa kết quả chụp chiếu!");
            location.reload(); // Reload lại trang để cập nhật dữ liệu
        })
        .catch(error => {
            alert("Có lỗi xảy ra khi xóa!");
            console.error("Error:", error);
        });
    }
}

function deletePrescription(medicationId) {
    if (confirm("Bạn có chắc chắn muốn xóa đơn thuốc này?")) {
        fetch(`/doctor/delete-prescription`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ medicationId })  
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Đã xóa đơn thuốc!");
                location.reload(); 
            } else {
                alert("Có lỗi khi gửi yêu cầu");
            }
        })
        .catch(error => {
            alert("Có lỗi xảy ra khi xóa!");
        });
    }
}

// Lưu kết quả test
function submitTestResult() {
    const testResults = [];
    const testIndicators = document.querySelectorAll("#test-indicator-container .test-indicator");

    // Đẩy các giá trị vào mảng testResults
    testIndicators.forEach(indicator => {
        const testIndicatorId = indicator.querySelector('input[name^="test_value_"]').id.split('_')[2]; 
        const testValue = indicator.querySelector('input[name^="test_value_"]').value;
        const comments = indicator.querySelector('input[name^="comment_"]').value;

        testResults.push({
            test_indicator_id: testIndicatorId,
            test_value: testValue,
            comments: comments
        });
    });

    // Gửi dữ liệu lên server
    fetch('/doctor/submit-test-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appointment_id: document.querySelector('input[name="appointment_id"]').value,
            test_results: testResults
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Kết quả xét nghiệm đã được lưu!');
            location.reload();
        } else {
            alert("Lưu thất bại");
        }
    })
    .catch(error => {
        console.error('Có lỗi xảy ra:', error);
        alert('Có lỗi khi lưu kết quả!');
    });
}

function saveImageResult() {
    const imagingTypeId = document.getElementById("imaging_type").value;
    const imageUrl = document.getElementById("image_url").value;
    const comments = document.getElementById("comments").value;

    // Gửi request để lưu kết quả mới
    fetch('/doctor/save-image-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            appointment_id: document.querySelector('input[name="appointment_id"]').value,
            imaging_type_id: imagingTypeId,
            imagingDate: new Date(),
            image_url: imageUrl,
            comments: comments
        })
    })
    .then(() => {
        alert("Kết quả chụp chiếu đã được lưu!");
        location.reload(); // Reload trang để cập nhật kết quả mới
    })
    .catch(error => {
        alert("Có lỗi xảy ra khi lưu kết quả!");
        console.error('Error saving image result:', error);
    });
}

// Check xem có đơn thuốc trùng không
const existingPrescriptions = Array.from(document.querySelectorAll('.existing-medication-id')).map(input => {
    return {
        medication_id: input.value,
    };
});

function checkMedicationExists(medicationId) {
    return existingPrescriptions.some(prescription => prescription.medication_id === medicationId);
}

function savePrescription() {
    const appointmentId = document.querySelector("input[name='appointment_id']").value;
    const medicationId = document.getElementById("medication_id").value;
    const usageInstructions = document.getElementById("usage_instructions").value;
    const quantity = document.getElementById("quantity").value;
    const unit = document.getElementById("unit").value;

    if (!medicationId || !usageInstructions || !quantity || !unit) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (checkMedicationExists(medicationId)) {
        alert("Thuốc này đã có trong đơn thuốc.");
        return; 
    }

    fetch(`/doctor/check-and-create-prescription/${appointmentId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            medicationId: medicationId,
            usage_instructions: usageInstructions,
            quantity: quantity,
            unit: unit
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {  
            alert("Đơn thuốc và chi tiết đã được lưu thành công!");
            location.reload(); 
        } else {
            alert("Đã xảy ra lỗi khi lưu đơn thuốc.");
        }
    })
    .catch(error => {
        console.error("Error saving prescription:", error);
        alert("Đã xảy ra lỗi khi gửi yêu cầu.");
    });
}
