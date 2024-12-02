const { Op } = require("sequelize");

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

            const patient = await Patient.findOne({
                where: { user_id: user.user_id }
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

            return res.render('results/viewresult', {
                layout: 'layouts/layout',
                isAuthenticated: true,
                user,
                patient,
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

        console.log(req.params)

        const appointment = await Appointment.findOne({
            where: { appointment_id: appointment_id },
        })

        console.log(JSON.stringify("appointment:", appointment))

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

        const distinctTestTypeIds = await TestIndicator.findAll({
            attributes: ['test_type_id'],  
            include: [
                {
                    model: TestResult,
                    attributes: [], 
                    where: { appointment_id }
                }
            ],
            group: ['test_type_id'] 
        });

        const testTypeIds = distinctTestTypeIds.map(item => item.test_type_id);

        const testTypes = await TestType.findAll({
            where: { test_type_id: { [Op.in]: testTypeIds } },
            attributes: ['test_type_name'],
            include: [
                {
                    model: TestIndicator,
                    attributes: ['test_indicator_name', 'unit', 'reference_range'],
                    include: [
                        {
                            model: TestResult,
                            attributes: ['test_value', 'comments', 'test_result_id'],
                            where: { appointment_id }
                        }
                    ]
                }
            ]
        });
        
        const results = testTypes.map(testType => {
            return {
                test_type_name: testType.test_type_name,
                test_indicators: testType.TestIndicators.map(testIndicator => {
                    return {
                        test_indicator_name: testIndicator.test_indicator_name,
                        unit: testIndicator.unit,
                        reference_range: testIndicator.reference_range,
                        test_value: testIndicator.TestResult.test_value,
                        comments: testIndicator.TestResult.comments,
                        test_result_id: testIndicator.TestResult.test_result_id
                    }
                })
            };
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
    
        console.log(JSON.stringify(patient))

        res.render('results/showresult', {
            layout: "layouts/layout",
            user,
            patient,
            diagnosis: diagnosis || [],
            results: results || [],
            imageResults: imageResults || [],
            prescriptionDetails: prescriptionDetails || [],
            appointment_id
        });
    }
}

module.exports = new ViewResultController;