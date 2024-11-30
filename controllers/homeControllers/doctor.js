const { Op } = require('sequelize');

const ShiftSchedule = require("../../models/ShiftSchedule.js");
const ShiftPeriod = require("../../models/ShiftPeriod.js");
const ClinicRoom = require("../../models/ClinicRoom.js");
const Doctor = require("../../models/Doctor.js");
const Appointment = require("../../models/Appointment.js");
const Patient = require("../../models/Patient.js");
const User = require("../../models/User.js");
const Department = require("../../models/Department.js");
const Diagnosis = require("../../models/Diagnosis.js");
const TestResult = require("../../models/TestResult.js")
const TestIndicator = require("../../models/TestIndicator.js");
const TestType = require("../../models/TestType.js");
const ImagingResult = require("../../models/ImagingResult.js");
const ImagingType = require("../../models/ImagingType.js");
const Prescription = require("../../models/Prescription.js");
const PrescriptionDetail = require("../../models/PrescriptionDetail.js");
const Medication = require("../../models/Medication.js");
const BloodType = require("../../models/BloodType.js");

class DoctorController {

    // [GET] /doctor
    async showShiftSchedule(req, res) {
        try {
            const user = req.user;
            const { page = 1 } = req.query;

            const limit = 20; 
            const offset = (page - 1) * limit;

            const doctor = await Doctor.findOne({
                where: { user_id: user.user_id },
                attributes: [ 'doctor_id' ]
            })

            // Truy vấn lịch trực của bác sĩ trong khoảng thời gian
            const { count, rows: shiftSchedules } = await ShiftSchedule.findAndCountAll({
                where: {
                    doctor_id: doctor.doctor_id,
                },
                include: [
                    {
                        model: ShiftPeriod,
                        attributes: ['shift_period_name'], // Lấy tên ca trực
                    },
                    {
                        model: ClinicRoom,
                        attributes: ['room_name'], // Lấy tên phòng khám
                    }
                ],
                limit: limit,          
                offset: offset,        
                order: [['shift_date', 'ASC']] // Sắp xếp theo ngày trực
            })
    
            // Tính toán tổng số trang
            const totalPages = Math.ceil(count / limit);
    
            return res.render("doctor/shiftschedule", {
                layout: "layouts/doctorLayout",
                user,
                searchDate: "",
                shiftSchedules, 
                totalPages, 
                currentPage: parseInt(page)
            })
        } catch (error) {
            console.error("Error fetching shift schedule:", error);
            throw error;
        }
    }

    // [GET] /search-shift-schedule
    async searchShiftSchedule(req, res) {
        try {
            const user = req.user;
            const page = 1;

            const limit = 20; 
            const offset = (page - 1) * limit;

            const doctor = await Doctor.findOne({
                where: { user_id: user.user_id },
                attributes: [ 'doctor_id' ]
            })

            // Tìm kiếm theo ngày nếu có
            const searchDate = req.query.date || '';  // Ngày tìm kiếm từ query param

            const { count, rows: shiftSchedules } = await ShiftSchedule.findAndCountAll({
                where: {
                    doctor_id: doctor.doctor_id,
                    shift_date: searchDate,
                },
                include: [
                    {
                        model: ShiftPeriod,
                        attributes: ['shift_period_name'],
                    },
                    {
                        model: ClinicRoom,
                        attributes: ['room_name'],
                    }
                ],
                limit: limit,
                offset: offset,
            });

            // Tính toán tổng số trang
            const totalPages = Math.ceil(count / limit);
    
            // Trả về dữ liệu cho view
            return res.render("doctor/shiftschedule", {
                layout: "layouts/doctorLayout",
                user,
                searchDate,
                shiftSchedules, 
                totalPages, 
                currentPage: page
            })
        } catch (error) {
            res.status(500).send("Có lỗi khi lấy lịch trực.");
        }
    }

    // [GET] /appointment
    async showAppointment(req, res) {
        const user = req.user;

        const { page = 1 } = req.query;
        const limit = 3;
        const offset = (page - 1) * limit;

        const doctor = await Doctor.findOne({
            where: { user_id: user.user_id }
        })

        // Truy vấn danh sách lịch khám
        const { count, rows: appointments } = await Appointment.findAndCountAll({
            where: { 
                doctor_id: doctor.doctor_id,
                status: 'Chờ Khám' 
            },
            include: [
                {
                    model: Patient,
                    include: {
                        model: User, 
                        attributes: ['full_name'],
                    },
                    attributes: [ 'patient_id' ],
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

        return res.render('doctor/appointment', {
            layout: 'layouts/doctorLayout',
            user,
            appointments,
            currentPage: parseInt(page),
            totalPages,
        });
    }

    // [GET] /edit-result
    async showResultPage(req, res) {
        const user = req.user;

        const { page = 1 } = req.query;
        const limit = 3;
        const offset = (page - 1) * limit;

        const doctor = await Doctor.findOne({
            where: { user_id: user.user_id }
        })

        // Truy vấn danh sách lịch khám
        const { count, rows: appointments } = await Appointment.findAndCountAll({
            where: { 
                doctor_id: doctor.doctor_id,
                status: { [Op.in]: ['Chờ Khám', 'Đã Khám'] }
            },
            include: [
                {
                    model: Patient,
                    include: {
                        model: User, 
                        attributes: ['full_name'],
                    },
                    attributes: [ 'patient_id' ],
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
            attributes: [ 'appointment_id', 'appointment_date', 'shift_period_id', 'status'], 
        });

        const totalPages = Math.ceil(count / limit);

        return res.render('doctor/editresult', {
            layout: 'layouts/doctorLayout',
            user,
            appointments,
            currentPage: parseInt(page),
            totalPages,
        });
    }

    // [GET] /edit-result/:appointment_id
    async showEditResultPage(req, res) {
        const user = req.user;
        const { appointment_id } = req.params;

        const appointment = await Appointment.findOne({
            where: { appointment_id },
        })

        const patient = await Patient.findOne({
            where: { patient_id: appointment.patient_id },
            include: [
                {
                    model: User,
                    attributes: [ 'full_name' ],
                },
                {
                    model: BloodType,
                    attributes: [ 'blood_type_name' ],
                }
            ]
        })

        const diagnosis = await Diagnosis.findOne({
            where: { appointment_id }
        });

        const testResults = await TestResult.findAll({
            where: { appointment_id },
            include: {
                model: TestIndicator,
                attributes: [ 'test_indicator_name', 'unit', 'reference_range' ],
                include: {
                    model: TestType,
                    attributes: [ 'test_type_name' ],
                }
            }
        });

        const imageResults = await ImagingResult.findAll({
            where: { appointment_id },
            include: {
                model: ImagingType,
                attributes: [ 'imaging_type_name' ],
            }
        });

        const prescription = await Prescription.findOne({
            where: { appointment_id },
        });

        let prescriptionDetails;
        if (prescription) {
            prescriptionDetails = await PrescriptionDetail.findAll({
                where: { prescription_id: prescription.prescription_id },
                include: {
                    model: Medication
                }
            })
        }
    
        res.render('doctor/result', {
            layout: "layouts/doctorLayout",
            user,
            patient,
            diagnosis: diagnosis || [],
            testResults: testResults || [],
            imageResults: imageResults || [],
            prescriptionDetails: prescriptionDetails || [],
            appointment_id
        });
    }

    // [GET] /get-test-types
    async getTestTypes(req, res) {
        const testTypes = await TestType.findAll();

        return res.json({ testTypes })
    }

    // [GET] /get-test-indicators/:test_type_id
    async getTestIndicators(req, res)  {
        const testTypeId =  req.params.test_type_id;

        try {
            const testIndicators = await TestIndicator.findAll({
                where: { test_type_id: testTypeId },
            });

            return res.json({ testIndicators });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // [GET] /get-imaging-types
    async getImagingTypes(req, res) {
        const imagingTypes = await ImagingType.findAll();

        return res.json({imagingTypes});
    }

    // [GET] /get-medications
    async getMedications(req, res) {
        const medications = await Medication.findAll();

        return res.json({medications});
    }

    // [POST] /submit-diagnosis
    async submitDiagnosis(req, res) {
        const { patient_id, appointment_id, blood_type, allergies, preliminary_diagnosis, final_diagnosis, treatmentPlan } = req.body;

        const cleanedPreliminaryDiagnosis = preliminary_diagnosis.trim();
        const cleanedFinalDiagnosis = final_diagnosis.trim();
        const cleanedTreatmentPlan = treatmentPlan.trim();

        if (blood_type && blood_type !== "0") {
            await Patient.update(
                {
                    blood_type_id: blood_type,
                },
                {
                    where: { patient_id: patient_id }
                }
            )
        }
    
        if (allergies && allergies !== "Chưa có") {
            await Patient.update(
                {
                    allergies: allergies,
                },
                {
                    where: { patient_id: patient_id }
                }
            )
        }

        const diagnosis = await Diagnosis.findOne({
            where: { appointment_id }
        })

        if (diagnosis) {
            await Diagnosis.update(
                {
                    preliminary_diagnosis: cleanedPreliminaryDiagnosis,
                    final_diagnosis: cleanedFinalDiagnosis,
                    diagnosis_date: new Date(),
                    treatmentPlan: cleanedTreatmentPlan
                },
                {
                    where: { appointment_id: appointment_id }
                }
            );
        } else {
            await Diagnosis.create({
                appointment_id: appointment_id,
                preliminary_diagnosis: cleanedPreliminaryDiagnosis,
                final_diagnosis: cleanedFinalDiagnosis,
                diagnosis_date: new Date(),
                treatmentPlan: cleanedTreatmentPlan
            });
        }

        const appointment = await Appointment.findOne({ where: { appointment_id } });
        if (appointment && appointment.status === 'Chờ khám') {
            await Appointment.update(
                { status: 'Đã khám' },
                { where: { appointment_id: appointment_id } }
            );
        }

        res.redirect(`/doctor/edit-result/${appointment_id}`);
    }

    // [POST] /submit-test-result
    async submitTestResult(req, res) {
        const { appointment_id, test_results } = req.body;

        test_results.forEach(async (result) => {
            const { test_indicator_id, test_value, comments } = result;
        
            // Lưu vào bảng TestResults
            await TestResult.create({
                appointment_id,
                test_indicator_id,
                test_value,
                test_date: new Date(),
                comments
            });

        });

        const appointment = await Appointment.findOne({ where: { appointment_id: appointment_id } });
        if (appointment && appointment.status === 'Chờ khám') {
            await Appointment.update(
                { status: 'Đã khám' },
                { where: { appointment_id: appointment_id } }
            );
        }

        return res.status(200).json({success: true});
    }

    // [POST] /save-image-result
    async saveImageResult(req, res) {
        const { appointment_id, imaging_type_id, image_url, comments } = req.body;

        try {
            await ImagingResult.create({
                appointment_id,
                imaging_type_id,
                image_url,
                comments
            });

            const appointment = await Appointment.findOne({ where: { appointment_id: appointment_id } });
            if (appointment && appointment.status === 'Chờ khám') {
                await Appointment.update(
                    { status: 'Đã khám' },
                    { where: { appointment_id: appointment_id } }
                );
            }

            res.status(200).json({ message: "Kết quả chụp chiếu đã được lưu thành công!" });
        } catch (error) {
            console.error("Error saving image result:", error);
            res.status(500).json({ message: "Đã có lỗi xảy ra khi lưu kết quả!" });
        }
    }

    // [POST] /check-and-create-prescription/${appointmentId}
    async checkAndCreatePrescription(req, res) {
        const appointmentId = req.params.appointmentId;
        const { medicationId, usage_instructions, quantity, unit } = req.body;

        // Tìm kiếm đơn thuốc hiện tại của appointmentId
        let prescription = await Prescription.findOne({ where: { appointment_id: appointmentId } });

        if (!prescription) {
            // Nếu không tìm thấy, tạo đơn thuốc mới
            prescription = await Prescription.create({
                appointment_id: appointmentId,
                prescription_date: new Date(),
                instructions: "Chưa có",
            });
        }

        // Tạo chi tiết đơn thuốc
        await PrescriptionDetail.create({
            prescription_id: prescription.prescription_id,
            medication_id: medicationId,
            quantity: quantity,
            unit: unit,
            usageInstructions: usage_instructions
        });

        const appointment = await Appointment.findOne({ where: { appointment_id: appointment_id } });
        if (appointment && appointment.status === 'Chờ khám') {
            await Appointment.update(
                { status: 'Đã khám' },
                { where: { appointment_id: appointmentId } }
            );
        }

        return res.status(200).json({success: true});
    }

    // [DELETE] /delete-image-result/:imageResultId
    async deleteImageResult(req, res) {
        const { imageResultId } = req.body;

         try {
            // Xóa kết quả hình ảnh với image_result_id tương ứng
            const result = await ImagingResult.destroy({
                where: {
                    imaging_result_id: imageResultId
                }
            });

            if (result > 0) {
                return res.status(200).json({ message: "Kết quả hình ảnh đã được xóa thành công!" });
            } else {
                return res.status(404).json({ message: "Không tìm thấy kết quả hình ảnh để xóa!" });
            }
    
        } catch (error) {
            console.error("Lỗi khi xóa kết quả hình ảnh:", error);
            return res.status(500).json({ message: "Đã có lỗi xảy ra khi xóa kết quả hình ảnh!" });
        }
        
    }

    // [DELETE] /delete-prescription/:prescriptionId
    async deletePrescription(req, res) {
        const { medicationId } = req.body;
        
        await PrescriptionDetail.destroy({
            where: {
                medication_id: medicationId
            }
        })

        return res.status(200).json({success: true});
    }
}

module.exports = new DoctorController;