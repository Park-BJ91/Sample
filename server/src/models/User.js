import { DataTypes, Op } from 'sequelize';
import mariadbSequelize from '../config/mariadb.js';
import bcrypt from 'bcrypt';


export const User = mariadbSequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING, unique: true, allowNull: false }, // allowNull은 NOT NULL 제약 조건
    password: { type: DataTypes.STRING, allowNull: false },
    nickName: { type: DataTypes.STRING, allowNull: false },
    profileImage: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true },
    addr: { type: DataTypes.STRING, allowNull: false },
    addressDetail: { type: DataTypes.STRING, allowNull: false },
    zonecode: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM("admin", "manager", "def"), defaultValue: "def" }
}, {
    tableName: 'tour_users', // 실제 테이블 이름 지정
    // timestamps: false,  // createdAt, updatedAt 자동 생성 방지
    freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
    underscored: false // 카멜케이스 -> 스네이크케이스 로 컬럼명 변환 방지 (createdAt -> created_at 처럼)
});


export const findUserAll = async () => {
    return await User.findAll();
}

export const findUserByUsername = async (name) => {
    return await User.findOne({ where: { userId: name } });
}

export const validatePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
}

export const createUser = async (userData) => {
    const transaction = await mariadbSequelize.transaction();
    try {
        await User.create(userData, { transaction });
        await transaction.commit();
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const userFindOrCreate = async (externalId) => {
    return await User.findOrCreate({
        where: { userId: externalId },
        defaults: { password: externalId } // 기본값 설정
    });
}