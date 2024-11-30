const User = require('../../models/User.js');
const ClinicRoom = require('../../models/ClinicRoom.js');
const Doctor = require('../../models/Doctor.js');
const Department = require('../../models/Department.js');
const DoctorDepartment = require('../../models/DoctorDepartment.js');
const Medication = require('../../models/Medication.js');
const ShiftSchedule = require('../../models/ShiftSchedule.js');
const ShiftPeriod = require('../../models/ShiftPeriod.js');
const { Op } = require('sequelize');  // Import Op từ Sequelize

class AdminController {
    // [GET] /admin
    showDashboard(req, res) {
        if (req.isAuthenticated()) {
            res.render('admin/dashboard', { 
                layout: 'layouts/adminLayout', 
                title: 'Admin Dashboard', // Thêm biến title
                isAuthenticated: true,
                user: req.user,
                errorMessage: null,
            });
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/users/new
    showAddUserForm(req, res) {
        if (req.isAuthenticated()) {
            res.render('admin/addUser', { 
                layout: 'layouts/adminLayout',
                title: 'Add User',
                isAuthenticated: true,
                user: req.user, 
                errorMessage: null 
            });
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/users/new
    async addUser(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { user_name, password, role, full_name, birthdate, gender, phone_number, address, email } = req.body;

                // Thêm người dùng mới
                await User.create({
                    user_name,
                    password, 
                    role,
                    full_name,
                    birthdate,
                    gender,
                    phone_number,
                    address,
                    email,
                });

                res.redirect('/admin');
            } catch (error) {
                console.error('Error adding user:', error);
                res.render('admin/addUser', { 
                    layout: 'layouts/adminLayout',
                    title: 'Add User',
                    isAuthenticated: true,
                    user: req.user, 
                    errorMessage: 'Không thể thêm người dùng!' 
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/users?page=1
    async listUsers(req, res) {
        if (req.isAuthenticated()) {
            try {
                const page = parseInt(req.query.page) || 1; // Lấy số trang, mặc định là trang 1
                const limit = 10; // Số user mỗi trang
                const offset = (page - 1) * limit; // Vị trí bắt đầu lấy user

                // Đếm tổng số user
                const totalUsers = await User.count();

                // Lấy danh sách user theo trang
                const users = await User.findAll({
                    limit,
                    offset,
                });

                const totalPages = Math.ceil(totalUsers / limit); // Tính tổng số trang

                res.render('admin/users', { 
                    layout: 'layouts/adminLayout',
                    title: 'User List',
                    isAuthenticated: true,
                    user: req.user,
                    users,
                    currentPage: page,
                    totalPages,
                    errorMessage: null,
                });
            } catch (error) {
                console.error('Error fetching user list:', error);
                res.redirect('/admin'); // Quay lại Dashboard nếu lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    
    // [POST] /admin/users/search
    async searchUser(req, res) {
        if (req.isAuthenticated()) {
            try {
                // Lấy username từ form tìm kiếm
                const { user_name } = req.body;
    
                if (!user_name) {
                    return res.redirect('/admin/users');  // Nếu không có username, redirect về trang danh sách người dùng
                }

    
                // Tìm kiếm người dùng theo username và sắp xếp theo user_id
                const users = await User.findAll({
                    where: {
                        user_name: {
                            [Op.like]: `${user_name}%`  // Tìm kiếm theo username bắt đầu với user_name
                        }
                    },
                    order: [
                        ['user_id', 'ASC']  // Sắp xếp theo user_id theo thứ tự tăng dần
                    ]
                });

    
                // Nếu không có user nào tìm thấy
                if (users.length === 0) {
                    return res.render('admin/users', {
                        layout: 'layouts/adminLayout',
                        title: 'User List',
                        isAuthenticated: true,
                        user: req.user,
                        users: [], // Không có kết quả tìm kiếm
                        errorMessage: `No users found with username starting with "${user_name}".`,
                        currentPage: 1, // Trang đầu tiên
                        totalPages: 1 // Chỉ có một trang vì kết quả tìm kiếm rỗng
                    });
                }

    
                // Nếu tìm thấy users, render danh sách người dùng tìm được
                res.render('admin/users', {
                    layout: 'layouts/adminLayout',
                    title: 'User List',
                    isAuthenticated: true,
                    user: req.user,
                    users: users, // Hiển thị danh sách người dùng tìm được
                    errorMessage: null,
                    currentPage: 1, // Trang đầu tiên
                    totalPages: 1 // Số trang mặc định
                });
            } catch (error) {
                console.error('Error searching for user:', error);
                res.redirect('/admin');
            }
        } else {
            res.redirect('/home');
        }
    }


    // [GET] /admin/users/:id/edit
    async showEditUserForm(req, res) {
        if (req.isAuthenticated()) {
            try {
                const user = await User.findByPk(req.params.id); // Lấy thông tin người dùng theo user_id
                if (!user) {
                    return res.redirect('/admin/users'); // Quay lại danh sách nếu không tìm thấy
                }
    
                res.render('admin/editUser', { 
                    layout: 'layouts/adminLayout',
                    title: 'Edit User',
                    isAuthenticated: true,
                    user: req.user,
                    editUser: user, // Truyền thông tin người dùng vào view
                    errorMessage: null, // Đảm bảo luôn có errorMessage, mặc dù không có lỗi
                });
            } catch (error) {
                console.error('Error loading edit form:', error);
                res.render('admin/editUser', {
                    layout: 'layouts/adminLayout',
                    title: 'Edit User',
                    isAuthenticated: true,
                    user: req.user,
                    editUser: null,
                    errorMessage: 'Không thể tải dữ liệu!' // Truyền thông báo lỗi nếu có
                });
            }
        } else {
            res.redirect('/home');
        }
    }    

    // [POST] /admin/users/:id
    async updateUser(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { full_name, role, phone_number, address, email, gender, birthdate, password } = req.body;
                const user = await User.findByPk(req.params.id);
    
                if (!user) {
                    return res.redirect('/admin/users'); // Quay lại danh sách nếu không tìm thấy
                }
    
                // Cập nhật thông tin
                const updatedData = {
                    full_name,
                    role,
                    phone_number,
                    address,
                    email,
                    gender,
                    birthdate,
                };
    
                // Nếu có mật khẩu mới, thêm vào dữ liệu cần cập nhật
                if (password) {
                    updatedData.password = password; // Cần mã hóa bằng bcrypt trước khi lưu
                }
    
                await user.update(updatedData);
    
                res.redirect('/admin/users'); // Quay lại danh sách người dùng
            } catch (error) {
                console.error('Error updating user:', error);
                res.redirect('/admin/users'); // Quay lại danh sách nếu lỗi
            }
        } else {
            res.redirect('/home');
        }
    }    

    // [POST] /admin/users/:id/delete
    async deleteUser(req, res) {
        if (req.isAuthenticated()) {
            try {
                const user = await User.findByPk(req.params.id);

                if (!user) {
                    return res.redirect('/admin/users'); // Quay lại danh sách nếu không tìm thấy
                }

                await user.destroy(); // Xóa người dùng
                res.redirect('/admin/users'); // Quay lại danh sách sau khi xóa
            } catch (error) {
                console.error('Error deleting user:', error);
                res.render('admin/users', {
                    layout: 'layouts/adminLayout',
                    title: 'User List',
                    isAuthenticated: true,
                    user: req.user,
                    users: [],
                    errorMessage: `Không thể xoá người dùng!`,
                    currentPage: 1, // Trang đầu tiên
                    totalPages: 1 // Chỉ có một trang
                });
                // res.redirect('/admin/users'); // Quay lại danh sách nếu lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/medicine/new
    showAddMedicineForm(req, res) {
        if (req.isAuthenticated()) {
            res.render('admin/addMedicine', { 
                layout: 'layouts/adminLayout',
                title: 'Add Medication',
                isAuthenticated: true,
                user: req.user, 
                errorMessage: null 
            });
        } else {
            res.redirect('/home');
        }
    }
    

    // [POST] /admin/medicine/new
    async addMedicine(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { medication_name, unit, description } = req.body;

                // Thêm thuốc mới vào cơ sở dữ liệu
                await Medication.create({
                    medication_name,
                    unit,
                    description,
                });

                res.redirect('/admin');
            } catch (error) {
                console.error('Error adding medication:', error);
                res.render('admin/addMedicine', { 
                    layout: 'layouts/adminLayout',
                    title: 'Add Medication',
                    isAuthenticated: true,
                    user: req.user, 
                    errorMessage: 'Không thể thêm thuốc!' 
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/medicine
    async listMedications(req, res) {
        if (req.isAuthenticated()) {
            try {
                const page = parseInt(req.query.page) || 1; // Lấy số trang, mặc định là trang 1
                const limit = 10; // Số medication mỗi trang
                const offset = (page - 1) * limit; // Vị trí bắt đầu lấy medication

                // Đếm tổng số medication
                const totalMedications = await Medication.count();

                // Lấy danh sách medication theo trang
                const medications = await Medication.findAll({
                    limit,
                    offset,
                });

                const totalPages = Math.ceil(totalMedications / limit); // Tính tổng số trang

                res.render('admin/medications', { 
                    layout: 'layouts/adminLayout',
                    title: 'Medication List',
                    isAuthenticated: true,
                    user: req.user,
                    medications,
                    currentPage: page,
                    totalPages,
                    errorMessage: null,
                });
            } catch (error) {
                console.error('Error fetching medication list:', error);
                res.redirect('/admin'); // Quay lại Dashboard nếu lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/medicine/search
    async searchMedication(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { medication_name } = req.body;

                if (!medication_name) {
                    return res.redirect('/admin/medicine');  // Nếu không có medication_name, redirect về trang danh sách medication
                }

                // Tìm kiếm medication theo tên
                const medications = await Medication.findAll({
                    where: {
                        medication_name: {
                            [Op.like]: `${medication_name}%`  // Tìm kiếm theo tên medication bắt đầu với medication_name
                        }
                    },
                    order: [
                        ['medication_id', 'ASC']  // Sắp xếp theo ID tăng dần
                    ]
                });

                // Nếu không có medication nào tìm thấy
                if (medications.length === 0) {
                    return res.render('admin/medications', {
                        layout: 'layouts/adminLayout',
                        title: 'Medication List',
                        isAuthenticated: true,
                        user: req.user,
                        medications: [], // Không có kết quả tìm kiếm
                        errorMessage: `No medications found with name starting with "${medication_name}".`,
                        currentPage: 1,
                        totalPages: 1
                    });
                }

                // Nếu tìm thấy medications, render danh sách medication tìm được
                res.render('admin/medications', {
                    layout: 'layouts/adminLayout',
                    title: 'Medication List',
                    isAuthenticated: true,
                    user: req.user,
                    medications: medications, // Hiển thị danh sách medication tìm được
                    errorMessage: null,
                    currentPage: 1,
                    totalPages: 1
                });
            } catch (error) {
                console.error('Error searching for medication:', error);
                res.redirect('/admin/medicine');
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/medicine/:id/edit
    async showEditMedicationForm(req, res) {
        if (req.isAuthenticated()) {
            try {
                const medication = await Medication.findByPk(req.params.id); // Lấy thông tin medication theo ID
                if (!medication) {
                    return res.redirect('/admin/medicine'); // Quay lại danh sách nếu không tìm thấy
                }

                res.render('admin/editMedication', { 
                    layout: 'layouts/adminLayout',
                    title: 'Edit Medication',
                    isAuthenticated: true,
                    user: req.user,
                    editMedication: medication, // Truyền thông tin medication vào view
                    errorMessage: null,
                });
            } catch (error) {
                console.error('Error loading edit form:', error);
                res.redirect('/admin/medicine');
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/medicine/:id
    async updateMedication(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { medication_name, unit, description } = req.body;
                const medication = await Medication.findByPk(req.params.id);

                if (!medication) {
                    return res.redirect('/admin/medicine'); // Quay lại danh sách nếu không tìm thấy
                }

                // Cập nhật thông tin
                const updatedData = {
                    medication_name,
                    unit,
                    description,
                };

                await medication.update(updatedData);

                res.redirect('/admin/medicine'); // Quay lại danh sách medications
            } catch (error) {
                console.error('Error updating medication:', error);
                res.redirect('/admin/medicine'); // Quay lại danh sách nếu lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/medicine/:id/delete
    async deleteMedication(req, res) {
        if (req.isAuthenticated()) {
            try {
                const medication = await Medication.findByPk(req.params.id);

                if (!medication) {
                    return res.redirect('/admin/medicine'); // Quay lại danh sách nếu không tìm thấy
                }

                await medication.destroy(); // Xóa medication
                res.redirect('/admin/medicine'); // Quay lại danh sách sau khi xóa
            } catch (error) {
                console.error('Error deleting medication:', error);
                res.redirect('/admin/medicine'); // Quay lại danh sách nếu có lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/schedule/new
    async showAddScheduleForm(req, res) {
        if (req.isAuthenticated()) {
            try {
                // Lấy danh sách khoa
                const departments = await Department.findAll({
                    attributes: ['department_id', 'department_name'],
                    order: [['department_id', 'ASC']], // Sắp xếp khoa theo department_id
                });

                // Lấy danh sách ca trực
                const shiftPeriods = await ShiftPeriod.findAll({
                    attributes: ['shift_period_id', 'shift_period_name'],
                    order: [['shift_period_id', 'ASC']],
                });

                res.render('admin/addSchedule', {
                    layout: 'layouts/adminLayout',
                    title: 'Add Shift Schedule',
                    isAuthenticated: true,
                    user: req.user,
                    departments,
                    shiftPeriods,
                    errorMessage: null, // Nếu có lỗi sẽ thông báo
                });
            } catch (error) {
                console.error('Error loading schedule form:', error);
                res.render('admin/addSchedule', {
                    layout: 'layouts/adminLayout',
                    title: 'Add Shift Schedule',
                    isAuthenticated: true,
                    user: req.user,
                    errorMessage: 'Không thể tải dữ liệu!'
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/schedule/new
    async addSchedule(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { clinicRoom_id, doctor_id, shift_date, shift_period_id } = req.body;

                // Thêm lịch trực vào ShiftSchedule
                await ShiftSchedule.create({
                    doctor_id,        // doctor_id lấy từ form
                    clinicRoom_id,    // clinicRoom_id lấy từ form
                    shift_date,       // shift_date lấy từ form
                    shift_period_id,  // shift_period_id lấy từ form
                });

                res.redirect('/admin'); // Quay lại danh sách lịch trực hoặc nơi quản lý lịch trực
            } catch (error) {
                console.error('Error adding schedule:', error);
                res.render('admin/addSchedule', {
                    layout: 'layouts/adminLayout',
                    title: 'Add Shift Schedule',
                    isAuthenticated: true,
                    user: req.user,
                    errorMessage: 'Error adding shift schedule.',
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/schedule/rooms/:departmentId
    async getClinicRoomsByDepartment(req, res) {
        const { departmentId } = req.params;
        try {
            const clinicRooms = await ClinicRoom.findAll({
                attributes: ['clinicRoom_id', 'room_name'],
                where: { department_id: departmentId },
            });
            res.json(clinicRooms);
        } catch (error) {
            console.error('Error fetching clinic rooms:', error);
            res.status(500).json({ message: 'Error retrieving clinic rooms' });
        }
    }

    // [GET] /admin/schedule/doctors/:departmentId
    async getDoctorsByDepartment(req, res) {
        const { departmentId } = req.params;
        try {
            // Lấy bác sĩ từ khoa đã chọn thông qua bảng trung gian DoctorDepartment
            const doctors = await Doctor.findAll({
                attributes: ['doctor_id'],
                include: [
                    {
                        model: User,  // Lấy thông tin bác sĩ từ bảng User
                        attributes: ['user_name', 'full_name'],
                        required: true, // Lọc bác sĩ có thông tin người dùng
                    },
                    {
                        model: DoctorDepartment,  // Kết nối với bảng DoctorDepartment
                        where: {
                            Departments_department_id: departmentId, // Lọc bác sĩ thuộc khoa đã chọn
                        },
                        required: true,
                    },
                ],
            });

            if (doctors.length === 0) {
                return res.status(404).json({ message: 'No doctors found for the selected department.' });
            }

            // Trả về danh sách bác sĩ dưới dạng JSON
            res.json(doctors); // Trả về thông tin bác sĩ để chọn
        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(500).json({ message: 'Error retrieving doctors' });
        }
    }
}

module.exports = new AdminController();
