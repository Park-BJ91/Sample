import { DataTypes } from "sequelize";
// import { mariadbSequelize } from "../config/mariadb.js";
import db from "../config/index.js";
import { User } from "./User.js";

// export const Favorite = mariadbSequelize.define('Favorite', {
export const Favorite = db.define('Favorite', {
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

// User.hasMany(Favorite, { foreignKey: 'userId', sourceKey: 'id' }); // 1(User) : N(Favorite)
// Favorite.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' }); // N(Favorite)  : 1(User)


/** 즐겨찾기 추가 */
export const addFavorite = async (favoriteData) => {
    // const t = await mariadbSequelize.transaction();
    const t = await db.transaction();
    try {
        await Favorite.create(favoriteData, { transaction: t });
        await t.commit();
        return { isFavorite: true };
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

/** 즐겨찾기 중복 여부 확인 (boolean 반환) */
export const isFavoriteExists = async (userId, contentId, contentTypeId) => {
    try {
        const count = await Favorite.count({ where: { userId, contentId, contentTypeId } });
        return count > 0;
    } catch (error) {
        throw error;
    }
}

/** 사용자 ID로 즐겨찾기 목록 조회 */
export const getFavoritesByUserId = async (userId) => {

    try {
        const rawFavorites = await Favorite.findAll({ where: { userId } });

        const typeMap = {
            12: '관광지',
            14: '문화시설',
            15: '행사/공연/축제',
            28: '레포츠',
            32: '숙박',
            38: '쇼핑',
            39: '음식점',
        };

        const favorites = rawFavorites.map(fav => {
            const obj = fav.get({ plain: true }); // Sequelize 객체를 일반 객체로 변환
            const key = Number(obj.contentTypeId);
            obj.contentTypeId = typeMap[key] || '기타';
            return obj;
        });

        return favorites;
    } catch (error) {
        throw error;
    }
}

/** 즐겨찾기 ID 찾기 */
export const getFavoriteId = async (userId, contentId) => {
    try {
        const favorite = await Favorite.findOne({ where: { userId, contentId } });
        return favorite.favId;
    } catch (error) {
        console.error("Error getting favorite ID:", error);
        throw error;
    }
}


/** 즐겨찾기 삭제 */
export const deleteFavorite = async (userId, favId) => {
    const t = await db.transaction();
    try {
        const result = await Favorite.destroy({ where: { userId, favId }, transaction: t });
        if (result === 0) {
            return { isFavorite: null };
        }
        await t.commit();
        return { isFavorite: false };
    } catch (error) {
        await t.rollback();
        throw error;
    }
}