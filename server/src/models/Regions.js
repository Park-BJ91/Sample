import { mariadbSequelize } from '../config/mariadb.js';
import { DataTypes } from 'sequelize';


export const Sido = mariadbSequelize.define("tour_sido", {
    sido_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sido_code: { type: DataTypes.STRING, unique: true },
    sido_name: { type: DataTypes.STRING, allowNull: false }
}, {
    createdAt: false, // 생성일  (true : 자동생성 / false : 수동생성)
    updatedAt: false, // 수정일 (true : 자동생성 / false : 수동생성)
    tableName: 'tour_sido', // 실제 테이블 이름 지정
    freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
});

export const Signgu = mariadbSequelize.define("tour_signgu", {
    signgu_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // sido_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Sido, key: 'sido_id' } }, // Foreign Key
    sido_id: { type: DataTypes.INTEGER, allowNull: false }, // Foreign Key
    signgu_code: { type: DataTypes.STRING, allowNull: false },
    signgu_name: { type: DataTypes.STRING, allowNull: false }
}, {
    createdAt: false, // 생성일  (true : 자동생성 / false : 수동생성)
    updatedAt: false, // 수정일 (true : 자동생성 / false : 수동생성)
    tableName: 'tour_signgu', // 실제 테이블 이름 지정
    freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
});

Sido.hasMany(Signgu, { foreignKey: 'sido_id' }); // 1:N 관계 설정 1=Primary, N=ForeignKey
Signgu.belongsTo(Sido, { foreignKey: 'sido_id' }); // N:1 관계 설정



