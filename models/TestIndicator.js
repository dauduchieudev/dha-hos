const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const TestIndicator = sequelize.define('TestIndicator', {
    test_indicator_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    test_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    test_indicator_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    reference_range: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Test_Indicators',
    timestamps: false,
});

module.exports = TestIndicator;
