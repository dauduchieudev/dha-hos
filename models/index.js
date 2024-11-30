const sequelize = require("../configs/database.js");

const Appointment = require('./Appointment');
const BloodType = require('./BloodType');
const ClinicRoom = require('./ClinicRoom');
const Department = require('./Department.js');
const Diagnosis = require('./Diagnosis.js');
const Doctor = require('./Doctor');
const DoctorDepartment = require('./DoctorDepartment');
const ImagingResult = require('./ImagingResult.js');
const ImagingType = require('./ImagingType.js');
const JobTitle = require('./JobTitle');
const MedicalRecord = require('./MedicalRecord');
const Medication = require('./Medication.js');
const Patient = require('./Patient');
const PrescriptionDetail = require('./PrescriptionDetail.js');
const Prescription = require('./Prescription.js');
const ShiftPeriod = require('./ShiftPeriod');
const ShiftSchedule = require('./ShiftSchedule');
const TestIndicator = require('./TestIndicator.js');
const TestResult = require('./TestResult.js');
const TestType = require('./TestType');
const User = require('./User');


// Quan hệ: ClinicRoom - Department
ClinicRoom.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(ClinicRoom, { foreignKey: 'department_id' });

// Quan hệ: Patients - Users (Một-Một)
Patient.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Patient, { foreignKey: 'user_id' });

// Quan hệ: Patients - Blood_Types
Patient.belongsTo(BloodType, { foreignKey: 'blood_type_id' });
BloodType.hasMany(Patient, { foreignKey: 'blood_type_id' });

// Quan hệ: Departments_Doctors - Doctors
DoctorDepartment.belongsTo(Doctor, { foreignKey: 'Doctors_doctor_id' });
Doctor.hasMany(DoctorDepartment, { foreignKey: 'Doctors_doctor_id' });

// Quan hệ: Departments_Doctors - Departments
DoctorDepartment.belongsTo(Department, { foreignKey: 'Departments_department_id' });
Department.hasMany(DoctorDepartment, { foreignKey: 'Departments_department_id' });

// Quan hệ: Doctors - Users (Một-Một)
Doctor.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Doctor, { foreignKey: 'user_id' });

// Quan hệ tự tham chiếu: Doctors - Doctors
Doctor.belongsTo(Doctor, { as: 'Supervisor', foreignKey: 'report_to' });
Doctor.hasMany(Doctor, { as: 'Reports', foreignKey: 'report_to' });

// Quan hệ: Doctors - Job_Titles
Doctor.belongsTo(JobTitle, { foreignKey: 'job_title_id' });
JobTitle.hasMany(Doctor, { foreignKey: 'job_title_id' });

// Quan hệ: ShiftSchedules - Doctors
ShiftSchedule.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(ShiftSchedule, { foreignKey: 'doctor_id' });

// Quan hệ: ShiftSchedules - ClinicRooms
ShiftSchedule.belongsTo(ClinicRoom, { foreignKey: 'clinicRoom_id' });
ClinicRoom.hasMany(ShiftSchedule, { foreignKey: 'clinicRoom_id' });

// Quan hệ: ShiftSchedules - Shift_Periods
ShiftSchedule.belongsTo(ShiftPeriod, { foreignKey: 'shift_period_id' });
ShiftPeriod.hasMany(ShiftSchedule, { foreignKey: 'shift_period_id' });

// Quan hệ: MedicalRecords - Patients
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id' });

// Quan hệ: Appointments - Patients
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });

// Quan hệ: Appointments - Doctors
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });

// Quan hệ: Appointments - MedicalRecords
Appointment.belongsTo(MedicalRecord, { foreignKey: 'medical_record_id' });
MedicalRecord.hasMany(Appointment, { foreignKey: 'medical_record_id' });

// Quan hệ: Appointments - ClinicRooms
Appointment.belongsTo(ClinicRoom, { foreignKey: 'clinicRoom_id' });
ClinicRoom.hasMany(Appointment, { foreignKey: 'clinicRoom_id' });

// Quan hệ: Appointments - Shift_Periods
Appointment.belongsTo(ShiftPeriod, { foreignKey: 'shift_period_id' });
ShiftPeriod.hasMany(Appointment, { foreignKey: 'shift_period_id' });

// Quan hệ: Diagnoses - Appointments (Một-Một)
Diagnosis.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasOne(Diagnosis, { foreignKey: 'appointment_id' });

// Quan hệ: Test_Indicators - Test_Types
TestIndicator.belongsTo(TestType, { foreignKey: 'test_type_id' });
TestType.hasMany(TestIndicator, { foreignKey: 'test_type_id' });

// Quan hệ: TestResults - Appointments
TestResult.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasMany(TestResult, { foreignKey: 'appointment_id' });

// Quan hệ: TestResults - Test_Indicators (Một-Một)
TestResult.belongsTo(TestIndicator, { foreignKey: 'test_indicator_id' });
TestIndicator.hasOne(TestResult, { foreignKey: 'test_indicator_id' });

// Quan hệ: ImagingResults - Appointments
ImagingResult.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasMany(ImagingResult, { foreignKey: 'appointment_id' });

// Quan hệ: ImagingResults - Imaging_Types
ImagingResult.belongsTo(ImagingType, { foreignKey: 'imaging_type_id' });
ImagingType.hasMany(ImagingResult, { foreignKey: 'imaging_type_id' });

// Quan hệ: Prescriptions - Appointments
Prescription.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasOne(Prescription, { foreignKey: 'appointment_id' });

// Quan hệ: PrescriptionDetails - Prescriptions
PrescriptionDetail.belongsTo(Prescription, { foreignKey: 'prescription_id' });
Prescription.hasMany(PrescriptionDetail, { foreignKey: 'prescription_id' });

// Quan hệ: PrescriptionDetails - Medications
PrescriptionDetail.belongsTo(Medication, { foreignKey: 'medication_id' });
Medication.hasMany(PrescriptionDetail, { foreignKey: 'medication_id' });

async function initModel() {
    await sequelize.sync();
}

module.exports = { initModel };
