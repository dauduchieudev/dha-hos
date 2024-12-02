const { Op } = require('sequelize');  // Import Op từ Sequelize

const BloodType = require('../../models/BloodType.js');
const ClinicRoom = require('../../models/ClinicRoom.js');
const Doctor = require('../../models/Doctor.js');
const Department = require('../../models/Department.js');
const DoctorDepartment = require('../../models/DoctorDepartment.js');
const JobTitle = require('../../models/JobTitle.js');
const Medication = require('../../models/Medication.js');
const Patient = require('../../models/Patient.js');
const ShiftSchedule = require('../../models/ShiftSchedule.js');
const ShiftPeriod = require('../../models/ShiftPeriod.js');
const User = require('../../models/User.js');

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

    // [GET] /admin/patients/new
    async showAddPatientForm(req, res) {
        if (req.isAuthenticated()) {
            try {
                // Lấy danh sách nhóm máu để hiển thị trong form
                const bloodTypes = await BloodType.findAll();
                
                res.render('admin/addPatient', {
                    layout: 'layouts/adminLayout',
                    title: 'Add New Patient',
                    isAuthenticated: true,
                    user: req.user,
                    bloodTypes, // Danh sách nhóm máu
                    errorMessage: null,
                });
            } catch (error) {
                console.error('Error loading blood types:', error);
                res.render('admin/addPatient', {
                    layout: 'layouts/adminLayout',
                    title: 'Add New Patient',
                    isAuthenticated: true,
                    user: req.user,
                    bloodTypes: [],
                    errorMessage: 'Không thể tải thông tin nhóm máu!',
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/patients/new
    async addPatient(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { user_name, password, full_name, birthdate, gender, phone_number, address, email, blood_type_id, allergies } = req.body;

                // Bước 1: Thêm người dùng vào bảng Users
                const user = await User.create({
                    user_name,
                    password,
                    role: 'Bệnh nhân', // Vai trò mặc định là Bệnh nhân
                    full_name,
                    birthdate,
                    gender,
                    phone_number,
                    address,
                    email: email || null, // Email có thể null
                });

                // Bước 2: Thêm bệnh nhân vào bảng Patients
                await Patient.create({
                    user_id: user.user_id, // Lấy user_id từ bảng Users
                    blood_type_id: blood_type_id || null, // Nhóm máu có thể null
                    allergies: allergies || null, // Dị ứng có thể null
                });

                res.redirect('/admin/patients/new'); // Sau khi thêm xong, quay lại form thêm bệnh nhân
            } catch (error) {
                console.error('Error adding patient:', error);
                try {
                    // Lấy danh sách nhóm máu để hiển thị trong form
                    const bloodTypes = await BloodType.findAll();
                    
                    res.render('admin/addPatient', {
                        layout: 'layouts/adminLayout',
                        title: 'Add New Patient',
                        isAuthenticated: true,
                        user: req.user,
                        bloodTypes, // Danh sách nhóm máu
                        errorMessage: 'Không thể thêm bệnh nhân!'
                    });
                } catch (error) {
                    console.error('Error loading blood types:', error);
                    res.render('admin/addPatient', {
                        layout: 'layouts/adminLayout',
                        title: 'Add New Patient',
                        isAuthenticated: true,
                        user: req.user,
                        bloodTypes: [],
                        errorMessage: 'Không thể tải thông tin nhóm máu!',
                    });
                }
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /admin/doctors/new
    async showAddDoctorForm(req, res) {
        if (req.isAuthenticated()) {
            try {
                // Lấy danh sách các khoa và chức danh công việc để hiển thị trong form
                const departments = await Department.findAll();
                const jobTitles = await JobTitle.findAll();

                res.render('admin/addDoctor', {
                    layout: 'layouts/adminLayout',
                    title: 'Add New Doctor',
                    isAuthenticated: true,
                    user: req.user,
                    departments,  // Truyền danh sách khoa
                    jobTitles,    // Truyền danh sách chức danh công việc
                    errorMessage: null
                });
            } catch (error) {
                console.error('Error loading form data:', error);
                res.render('admin/addDoctor', {
                    layout: 'layouts/adminLayout',
                    title: 'Add New Doctor',
                    isAuthenticated: true,
                    user: req.user,
                    departments: [],
                    jobTitles: [],
                    errorMessage: 'Không thể tải dữ liệu!'
                });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] /admin/doctors/new
    async addDoctor(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { 
                    user_name, password, full_name, birthdate, gender, 
                    phone_number, address, email, department_id, 
                    job_title_id, report_to, specialty 
                } = req.body;
    
                // Bước 1: Thêm người dùng vào bảng Users
                const user = await User.create({
                    user_name,
                    password,
                    role: 'Bác sĩ', // Vai trò mặc định là Bác sĩ
                    full_name,
                    birthdate,
                    gender,
                    phone_number,
                    address,
                    email: email || null, // Email có thể null
                });
    
                // Bước 2: Thêm bác sĩ vào bảng Doctors
                const doctor = await Doctor.create({
                    user_id: user.user_id, // Lấy user_id từ bảng Users
                    job_title_id, // Chức danh công việc
                    report_to: report_to || null, // Cấp trên (có thể để null)
                    specialty, // Chuyên môn
                });
    
                // Bước 3: Liên kết bác sĩ với các khoa trong bảng DoctorDepartment
                if (Array.isArray(department_id) && department_id.length > 0) {
                    // Lặp qua tất cả các department_id được chọn và tạo liên kết
                    for (let dept_id of department_id) {
                        await DoctorDepartment.create({
                            Departments_department_id: dept_id, // Khoa
                            Doctors_doctor_id: doctor.doctor_id, // Bác sĩ
                        });
                    }
                } else {
                    throw new Error("Please select at least one department.");
                }
    
                // Sau khi thêm bác sĩ thành công, quay lại form thêm bác sĩ
                res.redirect('/admin/doctors/new');
            } catch (error) {
                console.error('Error adding doctor:', error);
                try {
                    // Lấy danh sách các khoa và chức danh công việc để hiển thị trong form
                    const departments = await Department.findAll();
                    const jobTitles = await JobTitle.findAll();
        
                    res.render('admin/addDoctor', {
                        layout: 'layouts/adminLayout',
                        title: 'Add New Doctor',
                        isAuthenticated: true,
                        user: req.user,
                        departments,  // Truyền danh sách khoa
                        jobTitles,    // Truyền danh sách chức danh công việc
                        errorMessage: 'Không thể thêm bác sĩ! '
                    });
                } catch (error) {
                    console.error('Error loading form data:', error);
                    res.render('admin/addDoctor', {
                        layout: 'layouts/adminLayout',
                        title: 'Add New Doctor',
                        isAuthenticated: true,
                        user: req.user,
                        departments: [],
                        jobTitles: [],
                        errorMessage: 'Không thể tải dữ liệu!'
                    });
                }
            }
        } else {
            res.redirect('/home');
        }
    }    

    // [GET] /admin/doctors/search
    async searchDoctorByUsername(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { user_name } = req.query;

                if (!user_name) {
                    return res.json([]); // Nếu không có từ khóa, trả về mảng rỗng
                }

                // Tìm bác sĩ theo user_name bắt đầu với từ khóa
                const doctors = await Doctor.findAll({
                    include: {
                        model: User,
                        where: {
                            user_name: {
                                [Op.like]: `${user_name}%` // Tìm kiếm bác sĩ có user_name bắt đầu bằng từ khóa
                            }
                        },
                        attributes: ['user_name', 'full_name'], // Chỉ lấy user_name và full_name
                        order: [
                            ['user_name', 'ASC']  // Sắp xếp theo user_name theo thứ tự tăng dần
                        ]
                    }
                });

                // Trả về danh sách các bác sĩ có doctor_id, user_name và full_name
                res.json(doctors.map(doctor => ({
                    doctor_id: doctor.doctor_id, // Trả về doctor_id
                    user_name: doctor.User.user_name,
                    full_name: doctor.User.full_name
                })));
            } catch (error) {
                console.error('Error searching doctors:', error);
                res.json([]); // Trả về mảng rỗng nếu có lỗi
            }
        } else {
            res.redirect('/home');
        }
    }

    // // [GET] /admin/users/new
    // showAddUserForm(req, res) {
    //     if (req.isAuthenticated()) {
    //         res.render('admin/addUser', { 
    //             layout: 'layouts/adminLayout',
    //             title: 'Add User',
    //             isAuthenticated: true,
    //             user: req.user, 
    //             errorMessage: null 
    //         });
    //     } else {
    //         res.redirect('/home');
    //     }
    // }

    // // [POST] /admin/users/new
    // async addUser(req, res) {
    //     if (req.isAuthenticated()) {
    //         try {
    //             const { user_name, password, role, full_name, birthdate, gender, phone_number, address, email } = req.body;

    //             // Thêm người dùng mới
    //             await User.create({
    //                 user_name,
    //                 password, 
    //                 role,
    //                 full_name,
    //                 birthdate,
    //                 gender,
    //                 phone_number,
    //                 address,
    //                 email,
    //             });

    //             res.redirect('/admin');
    //         } catch (error) {
    //             console.error('Error adding user:', error);
    //             res.render('admin/addUser', { 
    //                 layout: 'layouts/adminLayout',
    //                 title: 'Add User',
    //                 isAuthenticated: true,
    //                 user: req.user, 
    //                 errorMessage: 'Không thể thêm người dùng!' 
    //             });
    //         }
    //     } else {
    //         res.redirect('/home');
    //     }
    // }

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
                res.render('admin/users', {
                    layout: 'layouts/adminLayout',
                    title: 'User List',
                    isAuthenticated: true,
                    user: req.user,
                    users: [],
                    errorMessage: `Không thể cập nhật người dùng!`,
                    currentPage: 1, // Trang đầu tiên
                    totalPages: 1 // Chỉ có một trang
                });
                // res.redirect('/admin/users'); // Quay lại danh sách nếu lỗi
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

                if (user.role === 'Bệnh nhân') {
                    // Tìm bệnh nhân và xóa trong bảng Patients
                    const patient = await Patient.findOne({ where: { user_id: user.user_id } });
                    if (patient) {
                        await patient.destroy(); // Xóa bệnh nhân
                    }
                } else if (user.role === 'Bác sĩ') {
                    // Tìm bác sĩ và xóa trong bảng Doctors và liên kết trong bảng DoctorDepartment
                    const doctor = await Doctor.findOne({ where: { user_id: user.user_id } });
                    if (doctor) {
                        await doctor.destroy(); // Xóa bác sĩ
                    }
                } else if (user.role === 'Quản lý') {
                    // Không thể xóa người dùng có role là Quản lý
                    throw new Error();
                }

                // Xóa người dùng trong bảng Users
                await user.destroy(); 

                // Quay lại danh sách sau khi xóa
                res.redirect('/admin/users');
            } catch (error) {
                console.error('Error deleting user:', error);
                res.render('admin/users', {
                    layout: 'layouts/adminLayout',
                    title: 'User List',
                    isAuthenticated: true,
                    user: req.user,
                    users: [],
                    errorMessage: 'Không thể xoá người dùng!',
                    currentPage: 1, // Trang đầu tiên
                    totalPages: 1 // Chỉ có một trang
                });
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

                res.redirect('/admin/medicine/new');
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
                res.render('admin/medications', {
                    layout: 'layouts/adminLayout',
                    title: 'Medication List',
                    isAuthenticated: true,
                    user: req.user,
                    medications: [],
                    errorMessage: 'Không thể cập nhật thuốc!',
                    currentPage: 1,
                    totalPages: 1
                });
                // res.redirect('/admin/medicine'); // Quay lại danh sách nếu lỗi
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
                res.render('admin/medications', {
                    layout: 'layouts/adminLayout',
                    title: 'Medication List',
                    isAuthenticated: true,
                    user: req.user,
                    medications: [],
                    errorMessage: 'Không thể xoá thuốc!',
                    currentPage: 1,
                    totalPages: 1
                });
                // res.redirect('/admin/medicine'); // Quay lại danh sách nếu có lỗi
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
                    departments: [],
                    shiftPeriods: [],
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
                
                res.redirect('/admin/schedule/new');
            } catch (error) {
                console.error('Error adding schedule:', error);
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
                        errorMessage: 'Error adding shift schedule.'
                    });
                } catch (error) {
                    console.error('Error loading schedule form:', error);
                    res.render('admin/addSchedule', {
                        layout: 'layouts/adminLayout',
                        title: 'Add Shift Schedule',
                        isAuthenticated: true,
                        user: req.user,
                        departments: [],
                        shiftPeriods: [],
                        errorMessage: 'Không thể tải dữ liệu!'
                    });
                }
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
