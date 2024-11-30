const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const TestResult = sequelize.define('TestResult', {
    test_result_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    test_indicator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    test_value: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    test_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'TestResults',
    timestamps: false,
});

module.exports = TestResult;
