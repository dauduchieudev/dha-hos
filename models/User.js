const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Quản lý', 'Bác sĩ', 'Bệnh nhân'),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Nam', 'Nữ'),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'Users',
    timestamps: false,
});

module.exports = User;
