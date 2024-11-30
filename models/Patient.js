const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Patient = sequelize.define('Patient', {
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blood_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    allergies: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'Patients', 
    timestamps: false, 
});

module.exports = Patient;
