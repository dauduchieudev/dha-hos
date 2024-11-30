const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ShiftPeriod = sequelize.define('ShiftPeriod', {
    shift_period_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shift_period_name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Shift_Periods',
    timestamps: false,  
});

module.exports = ShiftPeriod;
