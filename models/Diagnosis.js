const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Diagnosis = sequelize.define('Diagnosis', {
    diagnosis_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preliminary_diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    final_diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    diagnosis_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    treatmentPlan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Diagnoses',
    timestamps: false,
});

module.exports = Diagnosis;
