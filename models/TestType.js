const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const TestType = sequelize.define('TestType', {
    test_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    test_type_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Test_Types',
    timestamps: false,
});

module.exports = TestType;
