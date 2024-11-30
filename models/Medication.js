const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Medication = sequelize.define('Medication', {
    medication_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    medication_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Medications',
    timestamps: false,
});

module.exports = Medication;
