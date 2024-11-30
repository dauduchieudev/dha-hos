const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const PrescriptionDetail = sequelize.define('PrescriptionDetail', {
    prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    medication_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    usageInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'PrescriptionDetails',
    timestamps: false,
});

module.exports = PrescriptionDetail;
