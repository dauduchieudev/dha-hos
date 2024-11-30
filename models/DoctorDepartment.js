const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const DoctorDepartment = sequelize.define('DoctorDepartment', {
    Departments_department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    Doctors_doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    tableName: 'Departments_Doctors',
    timestamps: false,
});

module.exports = DoctorDepartment;
