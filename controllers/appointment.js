const Department = require("../models/Department.js");
const ClinicRoom = require("../models/ClinicRoom.js");
const ShiftSchedule = require("../models/ShiftSchedule.js");
const Doctor = require("../models/Doctor.js");
const User = require("../models/User.js");
const Patient = require("../models/Patient.js");
const Appointment = require("../models/Appointment.js");
const MedicalRecord = require("../models/MedicalRecord.js");

class AppointmentController {

    // [GET] /appointment/old
    async showOld(req, res) {
        if (req.isAuthenticated()) {
            const user = req.user; 

            const { page = 1 } = req.query;
            const limit = 3; 
            const offset = (page - 1) * limit; 

            const patient = await Patient.findOne({
                where: { user_id: user.user_id },
                attributes: [ 'patient_id' ]
            })

            // Truy vấn danh sách lịch khám
            const { count, rows: appointments } = await Appointment.findAndCountAll({
                where: { 
                    status: 'Đã khám',
                    patient_id: patient.patient_id
                }, 
                include: [
                    {
                        model: Doctor,
                        include: {
                            model: User, 
                            attributes: ['full_name'],
                        },
                        attributes: [ 'doctor_id' ],
                    },
                    {
                        model: ClinicRoom,
                        include: {
                            model: Department, 
                            attributes: ['department_name'],
                        },
                        attributes: ['room_name'], 
                    },
                ],
                offset,
                limit,
                order: [['appointment_date', 'DESC']],
                attributes: [ 'appointment_id', 'appointment_date', 'shift_period_id'], 
            });

            const totalPages = Math.ceil(count / limit);

            return res.render('appointments/old', {
                layout: 'layouts/layout',
                user,
                appointments,
                currentPage: parseInt(page),
                totalPages,
            });
        } else {
            res.redirect('/home'); 
        }
    }

    // [GET] /appointment/pending
    async showPending(req, res) {
        if (req.isAuthenticated()) {
            const user = req.user;

            const { page = 1 } = req.query;
            const limit = 3;
            const offset = (page - 1) * limit;

            const patient = await Patient.findOne({
                where: { user_id: user.user_id },
                attributes: [ 'patient_id' ]
            })

            // Truy vấn danh sách lịch khám
            const { count, rows: appointments } = await Appointment.findAndCountAll({
                where: { 
                    status: 'Đã khám',
                    patient_id: patient.patient_id
                },
                include: [
                    {
                        model: Doctor,
                        include: {
                            model: User, 
                            attributes: ['full_name'],
                        },
                        attributes: [ 'doctor_id' ],
                    },
                    {
                        model: ClinicRoom,
                        include: {
                            model: Department, 
                            attributes: ['department_name'],
                        },
                        attributes: ['room_name'], 
                    },
                ],
                offset,
                limit,
                order: [['appointment_date', 'ASC']],
                attributes: [ 'appointment_id', 'appointment_date', 'shift_period_id'], 
            });

            const totalPages = Math.ceil(count / limit);

            return res.render('appointments/pending', {
                layout: 'layouts/layout',
                user,
                appointments,
                currentPage: parseInt(page),
                totalPages,
            });
        } else {
            res.redirect('/home'); 
        }
    }

    // [POST] /pending/cancel
    async cancelAppointment(req, res) {
        const { appointment_id } = req.body;

        try {
            const appointment = await Appointment.findByPk(appointment_id);
            if (!appointment) {
                console.log("Không thấy lịch");
                return res.status(404).json({ error: 'Không tìm thấy lịch khám' });
            }

            appointment.status = 'Hủy'; 
            await appointment.save();

            res.status(200).json({ message: 'Lịch khám đã được hủy thành công', appointment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi hủy lịch khám' });
        }
    }

    // [GET] /appointment/new
    async showNew(req, res) {
        if (req.isAuthenticated()) { 
            const departments = await Department.findAll();

            const isAuthenticated = req.isAuthenticated();
            const user = req.user || null;

            return res.render('appointments/new', { 
                layout: 'layouts/layout', 
                user, 
                departments, 
                error: null 
            });
        } else {
            res.redirect('/home');
        }
    }

    // [GET] /appointment/renew
    async showRenew(req, res) {
        if (req.isAuthenticated()) {
            const user = req.user; 

            const { page = 1 } = req.query;
            const limit = 3; 
            const offset = (page - 1) * limit; 

            const patient = await Patient.findOne({
                where: { user_id: user.user_id },
                attributes: [ 'patient_id' ]
            })

            // Truy vấn danh sách lịch khám
            const { count, rows: appointments } = await Appointment.findAndCountAll({
                where: { 
                    status: 'Đã khám',
                    patient_id: patient.patient_id
                },
                include: [
                    {
                        model: Doctor,
                        include: {
                            model: User, 
                            attributes: ['full_name'],
                        },
                        attributes: [ 'doctor_id' ],
                    },
                    {
                        model: ClinicRoom,
                        include: {
                            model: Department, 
                            attributes: ['department_name'],
                        },
                        attributes: ['room_name'], 
                    },
                ],
                offset,
                limit,
                order: [['appointment_date', 'DESC']],
                attributes: [ 'appointment_id', 'appointment_date', 'shift_period_id'], 
            });

            const totalPages = Math.ceil(count / limit);

            return res.render('appointments/renew', {
                layout: 'layouts/layout',
                user,
                appointments,
                currentPage: parseInt(page),
                totalPages,
            });
        } else {
            res.redirect('/home'); 
        }
    }

    // [GET] new/get-ramdom-department
    async getRamdomDepartment(req, res) {
        if (req.isAuthenticated()) {
            try {
                // Lấy tất cả các department từ cơ sở dữ liệu
                const departments = await Department.findAll();
    
                // Chọn ngẫu nhiên một khoa
                const randomIndex = Math.floor(Math.random() * departments.length);
                const randomDepartment = departments[randomIndex];

                // Lấy thêm danh sách phòng khám thuộc khoa
                const clinics = await ClinicRoom.findAll({
                    where: { department_id: randomDepartment.department_id },
                    attributes: ['clinicRoom_id', 'room_name'],
                });
    
                // Trả về department ngẫu nhiên
                res.status(200).json({
                    department: {
                        department_id: randomDepartment.department_id,
                        department_name: randomDepartment.department_name,
                    },
                    clinics: clinics.map(clinic => ({
                        id: clinic.clinicRoom_id,
                        name: clinic.room_name,
                    })),
                });
            } catch (error) {
                console.error('Error fetching random department:', error);
                res.status(500).json({ error: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] new/get-clinics
    async getClinics(req, res) {
        if (req.isAuthenticated()) {
            try {
                const { department_id } = req.query;
    
                const clinics = await ClinicRoom.findAll({
                    where: { department_id },
                    attributes: ['clinicRoom_id', 'room_name'],
                });
    
                res.status(200).json({
                    clinics: clinics.map(clinic => ({
                        id: clinic.clinicRoom_id,
                        name: clinic.room_name,
                    })),
                });
            } catch (error) {
                console.error('Error fetching clinics:', error);
                res.status(500).json({ error: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [GET] renew/:appointment_id
    async getReVisit(req, res) {
        if (req.isAuthenticated()) {
            const { appointment_id } = req.params;
            const user = req.user;

            try {
                const appointment = await Appointment.findOne({
                    where: { appointment_id },
                    include: [
                        {
                            model: ClinicRoom, 
                            include: {
                                model: Department,
                                attributes: [ 'department_name', 'department_id' ]
                            }, 
                        },
                    ],
                    attributes: [ 'medical_record_id' ],
                });

                if (!appointment) {
                    console.log("Appointment không tìm thấy");
                    return res.status(404).json({ error: 'Không tìm thấy lịch khám.' });
                }

                res.json({
                    html: `
                    <h2 class="mb-4">Đặt lịch tái khám</h2>
                    <div class="appointment-container">
                        <div class="new-detail">
                            <label for="description" class="form-label">Mô tả bệnh:</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                class="styled-textarea" 
                                placeholder="Nhập mô tả bệnh tại đây..."
                            ></textarea>
                        </div>
                        <form method="POST" action="/appointment/renew/create-reappointment" class="appointment-form">
                            <input type="hidden" name="description" id="hidden-description">    
                            <input type="hidden" name="user_id" value="${user.user_id}">
                            
                            <label for="department" class="form-label">Khoa:</label>
                            <span id="department-display" class="display-only">
                                ${appointment.ClinicRoom.Department.department_name}
                            </span>

                            <input 
                                type="hidden" 
                                id="department" 
                                name="department" 
                                value="${appointment.ClinicRoom.Department.department_id}" 
                            />

                            <input
                                type="hidden"
                                id="medical-record"
                                name="medicalRecordId"
                                value="${appointment.medical_record_id}"
                            />
                            
                            <label for="clinic" class="form-label">Phòng khám:</label>
                            <select id="clinic" name="clinic" class="styled-select select-clinic">
                                <option value="">Chọn phòng khám</option>
                            </select>
                            
                            <label for="date" class="form-label">Chọn ngày:</label>
                            <input type="date" id="date" name="date" class="styled-select input-date">
                            
                            <label for="period" class="form-label">Chọn buổi:</label>
                            <select id="period" name="period" class="styled-select select-period">
                                <option value="">Chọn buổi</option>
                                <option value="1">Sáng</option>
                                <option value="2">Chiều</option>
                                <option value="3">Tối</option>
                            </select>
                            
                            <label for="doctor" class="form-label">Bác sĩ:</label>
                            <select id="doctor" name="doctor" class="styled-select select-doctor"></select>
                            
                            <button type="submit" class="submit-button">Đặt lịch</button>
                        </form>
                    </div>`
                });
            } catch (error) {
                console.error("Lỗi khi tải form tái khám:", error);
                res.status(500).json({ error: 'Đã xảy ra lỗi khi tải form tái khám.' });
            }
        } else {
            res.redirect('/home');
        }
    }

    // [POST] new/get-available-doctors
    async getAvailableDoctors(req, res) {
        try {

            const { date, shift_period_id, clinicRoom_id } = req.body;

            // Truy vấn danh sách bác sĩ phù hợp
            const shiftSchedules = await ShiftSchedule.findAll({
                where: {
                    clinicRoom_id,
                    shift_period_id,
                    shift_date: date
                },
                attributes: [ 'doctor_id' ],
            })

            const doctorIds = shiftSchedules.map(shiftSchedule => shiftSchedule.doctor_id);

            const doctors = await Doctor.findAll({
                where: {
                    doctor_id: doctorIds
                },
                include: [
                    {
                        model: User,
                        attributes: [ 'full_name' ]
                    }
                ],
                attributes: [ 'doctor_id' ]
            });

            // Trả về danh sách bác sĩ dưới dạng JSON
            res.status(200).json({
                doctors: doctors.map(doctor => ({
                    id: doctor.doctor_id,
                    full_name: doctor.User.full_name,
                })),
            });
        } catch (error) {
            console.error('Error fetching available doctors:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
        }
    }

    // [POST] /create-appointment
    async createAppointment(req, res) {
        try {
            const { description, user_id, department, clinic, date, period, doctor } = req.body;

            const patient = await Patient.findOne({
                where: {
                    user_id,
                },
                attributes: [ 'patient_id' ]
            })

            const existingAppointment = await Appointment.findOne({
                where: {
                    patient_id: patient.patient_id,
                    appointment_date: date,
                    shift_period_id: period,
                    status: "Chờ khám",
                },
            });

            if (existingAppointment) {
                const departments = await Department.findAll();

                const isAuthenticated = req.isAuthenticated();
                const user = req.user || null;

                return res.render('appointments/new', { layout: 'layouts/layout', isAuthenticated, user, departments, 
                    error: 'Lịch hẹn đã bị trùng. Vui lòng chọn thời gian khác.' });
            }

            const newMedicalRecord = await MedicalRecord.create({
                patient_id: patient.patient_id,
                admission_date: date,
                discharge_date: null,
            });

            const newAppointment = await Appointment.create({
                patient_id: patient.patient_id,
                doctor_id: doctor,
                medical_record_id: newMedicalRecord.medical_record_id,
                clinicRoom_id: clinic,
                symptoms: description,
                appointment_date: date,
                shift_period_id: period,
            });

            res.redirect('/appointment/pending');
        } catch (error) {
            console.error('Error creating medical record:', error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo bệnh án.' });
        }
    }

    // [POST] /renew/create-reappointment
    async createReAppointment(req, res) {
        try {
            const { description, user_id, department, medicalRecordId, clinic, date, period, doctor } = req.body;

            const patient = await Patient.findOne({
                where: {
                    user_id,
                },
                attributes: [ 'patient_id' ]
            })

            const existingAppointment = await Appointment.findOne({
                where: {
                    patient_id: patient.patient_id,
                    appointment_date: date,
                    shift_period_id: period,
                    status: "Chờ khám",
                },
            });

            if (existingAppointment) {
                const departments = await Department.findAll();

                const isAuthenticated = req.isAuthenticated();
                const user = req.user || null;

                return res.render('appointments/new', { 
                    layout: 'layouts/layout', 
                    user, 
                    departments, 
                    error: 'Lịch hẹn đã bị trùng. Vui lòng chọn thời gian khác.' 
                });
            }

            const newAppointment = await Appointment.create({
                patient_id: patient.patient_id,
                doctor_id: doctor,
                medical_record_id: medicalRecordId,
                clinicRoom_id: clinic,
                symptoms: description,
                appointment_date: date,
                shift_period_id: period,
            });

            res.redirect('/appointment/pending');
        } catch (error) {
            console.error('Error creating medical record:', error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo bệnh án.' });
        }
    }
}

module.exports = new AppointmentController;