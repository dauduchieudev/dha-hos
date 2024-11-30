const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ClinicRoom = sequelize.define('ClinicRoom', {
    clinicRoom_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    room_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'ClinicRooms', 
    timestamps: false,  
});

module.exports = ClinicRoom;
