const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const BloodType = sequelize.define('BloodType', {
    blood_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    blood_type_name: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Blood_Types',
    timestamps: false,
});

module.exports = BloodType;
