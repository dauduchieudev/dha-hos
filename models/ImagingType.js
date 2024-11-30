const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ImagingType = sequelize.define('ImagingType', {
    imaging_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imaging_type_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Imaging_Types',
    timestamps: false,
});

module.exports = ImagingType;
