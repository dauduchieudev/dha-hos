const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Doctor = sequelize.define('Doctor', {
    doctor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    report_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    job_title_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'Doctors', 
    timestamps: false, 
});

module.exports = Doctor;
