import { DataTypes, Op } from 'sequelize';
import mariadbSequelize from '../config/mariadb.js';
import bcrypt from 'bcrypt';


const User = mariadbSequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, unique: true, allowNull: false }, // allowNull은 NOT NULL 제약 조건
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "manager", "def"), defaultValue: "def" }
}, {
    tableName: 'c_users', // 실제 테이블 이름 지정
    timestamps: false,  // createdAt, updatedAt 자동 생성 방지
    freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
    underscored: true // 카멜케이스 -> 스네이크케이스 로 컬럼명 변환 방지 (createdAt -> created_at 처럼)
});


export const findUserAll = async () => {
    return await User.findAll();
}

export const findUserByUsername = async (name) => {
    return await User.findOne({ where: { user_id: name } });
}

export const validatePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
}

export const createUser = async (user_id, email, password) => {
    return await User.create({ user_id, email, password });
}

export const userFindOrCreate = async (externalId) => {
    return await User.findOrCreate({
        where: { user_id: externalId },
        defaults: { password: externalId } // 기본값 설정
    });
}