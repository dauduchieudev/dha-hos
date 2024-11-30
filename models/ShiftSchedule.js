const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ShiftSchedule = sequelize.define('ShiftSchedule', {
    shiftSchedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clinicRoom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    shift_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    shift_period_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'ShiftSchedules', 
    timestamps: false,
});

module.exports = ShiftSchedule;
