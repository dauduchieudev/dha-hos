const User = require("../models/User.js");
const Appointment = require("../models/Appointment.js");
const Doctor = require("../models/Doctor.js");
const Department = require("../models/Department.js");
const ClinicRoom = require("../models/ClinicRoom.js");
const Diagnosis = require("../models/Diagnosis.js");
const Patient = require("../models/Patient.js");
const TestResult = require("../models/TestResult.js")
const TestIndicator = require("../models/TestIndicator.js");
const TestType = require("../models/TestType.js");
const ImagingResult = require("../models/ImagingResult.js");
const ImagingType = require("../models/ImagingType.js");
const Prescription = require("../models/Prescription.js");
const PrescriptionDetail = require("../models/PrescriptionDetail.js");
const Medication = require("../models/Medication.js");
const BloodType = require("../models/BloodType.js");

class ViewResultController {

    // [GET] /view-result
    async show(req, res) {
        if (req.isAuthenticated()) {
            const user = req.user; 

            const { page = 1 } = req.query;
            const limit = 3; 
            const offset = (page - 1) * limit; 

            // Truy vấn danh sách lịch khám
            const { count, rows: appointments } = await Appointment.findAndCountAll({
                where: { status: 'Đã khám' }, 
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

            return res.render('results/viewresult', {
                layout: 'layouts/layout',
                isAuthenticated: true,
                user,
                appointments,
                currentPage: parseInt(page),
                totalPages,
            });
        } else {
            res.redirect('/home'); 
        }
    }

    // [POST] /showresult
    async showResult(req, res) {
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
        
        res.render('results/showresult', {
            layout: "layouts/layout",
            user,
            patient,
            diagnosis: diagnosis || [],
            testResults: testResults || [],
            imageResults: imageResults || [],
            prescriptionDetails: prescriptionDetails || [],
        });
    }
}

module.exports = new ViewResultController;