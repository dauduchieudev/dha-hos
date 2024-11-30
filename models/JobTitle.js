const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const JobTitle = sequelize.define('JobTitle', {
    job_title_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_title_name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Job_Titles',
    timestamps: false,
});

module.exports = JobTitle;
