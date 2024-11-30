const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    medical_record_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    admission_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW, 
    },
    discharge_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    tableName: 'MedicalRecords',
    timestamps: false,
});

module.exports = MedicalRecord;
