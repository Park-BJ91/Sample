import { DataTypes } from "sequelize";
import { mariadbSequelize } from "../config/mariadb.js";
import { User } from "./User.js";

export const Favorite = mariadbSequelize.define('Favorite', {
    favId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    contentId: { type: DataTypes.INTEGER, allowNull: false },
    contentTypeId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    addr: { type: DataTypes.STRING },
    imgUrl: { type: DataTypes.STRING },
}, {
    tableName: 'tour_favorite',
    createdAt: false,
    updatedAt: false,
    freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
});

User.hasMany(Favorite, { foreignKey: 'userId', sourceKey: 'id' });
Favorite.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });


/** 즐겨찾기 추가 */
export const addFavorite = async (favoriteData) => {
    const t = await mariadbSequelize.transaction();
    try {
        await Favorite.create(favoriteData, { transaction: t });
        await t.commit();
        return { success: true };
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

/** 즐겨찾기 중복 여부 확인 (boolean 반환) */
export const isFavoriteExists = async (userId, contentId, contentTypeId) => {
    try {
        const count = await Favorite.count({ where: { userId, contentId, contentTypeId } });
        console.log(count);
        return count > 0;
    } catch (error) {
        throw error;
    }
}

/** 사용자 ID로 즐겨찾기 목록 조회 */
export const getFavoritesByUserId = async (userId) => {
    try {
        const favorites = await Favorite.findAll({ where: { userId } });
        return favorites;
    } catch (error) {
        throw error;
    }
}

/** 즐겨찾기 삭제 */
export const deleteFavorite = async (userId, favId) => {
    const t = await mariadbSequelize.transaction();
    try {
        const result = await Favorite.destroy({ where: { userId, favId }, transaction: t });
        await t.commit();
        return result; // 삭제된 행의 수 반환
    } catch (error) {
        await t.rollback();
        throw error;
    }
}