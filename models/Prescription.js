const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Prescription = sequelize.define('Prescription', {
    prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prescription_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Prescriptions',
    timestamps: false,
});

module.exports = Prescription;