const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Appointment = sequelize.define('Appointment', {
    appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    medical_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clinicRoom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    symptoms: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    shift_period_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Đã khám', 'Chờ khám', 'Huỷ'),
        allowNull: false,
        defaultValue: 'Chờ khám',
    },
}, {
    tableName: 'Appointments',
    timestamps: false,
});

module.exports = Appointment;
