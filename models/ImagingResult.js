const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ImagingResult = sequelize.define('ImagingResult', {
    imaging_result_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imaging_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imaging_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'ImagingResults',
    timestamps: false,
});

module.exports = ImagingResult;
