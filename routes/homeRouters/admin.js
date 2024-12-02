const adminController = require("../../controllers/homeControllers/admin.js");

const express = require("express");
const router = express.Router();

// Route chính: Hiển thị Dashboard
router.get('/', adminController.showDashboard);

// [POST] /admin/users/search - Tìm kiếm người dùng
router.post('/users/search', adminController.searchUser);

// Route quản lý người dùng
router.get('/users', adminController.listUsers); // Hiển thị danh sách người dùng
router.get('/users/:id/edit', adminController.showEditUserForm); // Hiển thị form chỉnh sửa
router.post('/users/:id', adminController.updateUser); // Xử lý cập nhật người dùng
router.post('/users/:id/delete', adminController.deleteUser); // Xử lý xóa người dùng

// Route quản lý bệnh nhân
router.get('/patients/new', adminController.showAddPatientForm);  // Hiển thị form thêm bệnh nhân
router.post('/patients/new', adminController.addPatient);         // Xử lý thêm bệnh nhân

// [POST] /admin/doctors/search - Tìm kiếm bác sĩ theo user_name
router.get('/doctors/search', adminController.searchDoctorByUsername);

// Route quản lý bác sĩ
router.get('/doctors/new', adminController.showAddDoctorForm);  // Hiển thị form thêm bác sĩ
router.post('/doctors/new', adminController.addDoctor);         // Xử lý thêm bác sĩ

// Route xử lý tìm kiếm thuốc
router.post('/medicine/search', adminController.searchMedication);

// Route thêm thuốc mới
router.get('/medicine/new', adminController.showAddMedicineForm); // Hiển thị form thêm thuốc
router.post('/medicine/new', adminController.addMedicine);        // Xử lý thêm thuốc

// Route quản lý thuốc
router.get('/medicine', adminController.listMedications);
router.get('/medicine/:id/edit', adminController.showEditMedicationForm);
router.post('/medicine/:id', adminController.updateMedication);
router.post('/medicine/:id/delete', adminController.deleteMedication);

// Route để hiển thị và thêm lịch trực
router.get('/schedule/new', adminController.showAddScheduleForm); // Hiển thị form thêm lịch trực
router.post('/schedule/new', adminController.addSchedule); // Thêm lịch trực (sử dụng POST)

// Route lấy các phòng khám của khoa đã chọn
router.get('/schedule/rooms/:departmentId', adminController.getClinicRoomsByDepartment);

// Route lấy các bác sĩ của khoa đã chọn
router.get('/schedule/doctors/:departmentId', adminController.getDoctorsByDepartment);

module.exports = router;
