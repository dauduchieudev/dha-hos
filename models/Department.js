const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database'); 

const Department = sequelize.define('Department', {
    department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    department_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Departments', 
    timestamps: false,   
});

module.exports = Department;
