import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';


const User = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: false, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "manager", "def"), defaultValue: "def" }
}, {
    timestamps: false,
    tableName: 'users'
});


export const userFindAll = async () => {
    return await User.findAll();
}

export const findUserByUsername = async (name) => {
    return await User.findOne({ where: { username: name } });
}

export const validatePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
}

export const createUser = async (username, password) => {
    return await User.create({ username, password });
}

export const userFindOrCreate = async (externalId) => {
    return await User.findOrCreate({
        where: { username: externalId },
        defaults: { password: externalId } // 기본값 설정
    });
}