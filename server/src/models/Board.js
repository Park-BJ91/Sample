// import { mariadbSequelize } from '../config/mariadb.js';
import db from '../config/index.js';
import { DataTypes, Sequelize } from 'sequelize';


// const sequelize = new Sequelize('sqlite::memory:', {
//     define: {
//         freezeTableName: true, // 모델 이름을 테이블 이름으로 사용 (테이블 이름 복수형 변환 방지)
//         timestamps: true, // createdAt, updatedAt 자동 생성
//         hooks: {
//             beforeCreate: (record) => {
//                 record.updatedAt = null;
//             }
//         }
//     }
// }); // 예시로 SQLite 메모리 데이터베이스 사용
// const Ux = sequelize.define('Userx', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     userId: { type: DataTypes.STRING, unique: true, allowNull: false }, // allowNull은 NOT NULL 제약 조건
//     password: { type: DataTypes.STRING, allowNull: false },
//     createdAt: { type: DataTypes.NOW, allowNull: false },
//     updatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
// });
// const Px = sequelize.define('Store', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: true },
//     createdAt: { type: DataTypes.NOW, allowNull: false },
//     updatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
// });
// const pxSync = await Px.sync({ force: true }); // 테이블 생성
// const uxSync = await Ux.sync({ force: true }); // 테이블 생성
// const pxCreate = await Px.create({ name: 'Test Store' });
// console.log("Store 데이터 생성 완료", pxCreate.dataValues);
// const uxCreate = await Ux.create({ userId: 'testuser', password: 'password123' });
// console.log("Userx 데이터 생성 완료", uxCreate.dataValues);
// // Sqlite 전체 테이블
// const tables = await sequelize.getQueryInterface().showAllTables();
// console.log("전체 테이블", tables); // ['Users']


/** Board Model */
// export const Board = mariadbSequelize.define('Board', {
export const Board = db.define('Board', {
    bno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updatedAt: { type: DataTypes.DATE, defaultValue: null }
}, {
    tableName: 'board',
    timestamps: false,
});

/** BoardImage Model */
// export const BoardImage = mariadbSequelize.define('BoardImage', {
export const BoardImage = db.define('BoardImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    boardId: { type: DataTypes.INTEGER, allowNull: true }, // 임시 이미지일 때는 null
    originalName: { type: DataTypes.STRING, allowNull: false },
    storedPath: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('temp', 'confirmed', 'deleted'), defaultValue: 'temp' },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, {
    tableName: 'board_images',
    timestamps: false
});

/** Comment Model */
// export const Comment = mariadbSequelize.define('Comment', {
export const Comment = db.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
}, {
    tableName: 'comments',
    timestamps: false
});

/** BoardLike Model */
// export const BoardLike = mariadbSequelize.define('BoardLike', {
export const BoardLike = db.define('BoardLike', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, {
    tableName: 'board_likes',
    timestamps: false
});


/* Board Start */

/** Board 생성 */
export const createBoard = async (boardData) => {
    const t = await db.transaction();
    try {
        const board = await Board.create(boardData, { transaction: t });
        await t.commit();
        return board;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/* Board End */


/* BoardImage Start  */

/** BoardImage 생성 */
export const addBoardImage = async (imageData) => {
    const t = await db.transaction();
    try {
        const image = await BoardImage.create(imageData, { transaction: t });
        await t.commit();
        return image;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/** BoardImage 삭제 */
export const boardTempImageDeleteDB = async (userId, imageUrl) => {
    const t = await db.transaction();
    try {
        const result = await BoardImage.destroy({ where: { userId, url: imageUrl.url, id: imageUrl.id }, transaction: t });
        await t.commit();
        return result;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/* BoardImage End  */



/* Comment  */
export const addComment = async (commentData) => {
    const t = await db.transaction();
    try {
        const comment = await Comment.create(commentData, { transaction: t });
        await t.commit();
        return comment;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/* BoardLike  */
export const addBoardLike = async (likeData) => {
    const t = await db.transaction();
    try {
        const like = await BoardLike.create(likeData, { transaction: t });
        await t.commit();
        return like;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/* BoardLike 삭제 */
export const removeBoardLike = async (boardId, userId) => {
    const t = await db.transaction();
    try {
        const result = await BoardLike.destroy({ where: { boardId, userId }, transaction: t });
        await t.commit();
        return result; // 삭제된 행의 수 반환
    } catch (error) {
        await t.rollback();
        throw error;
    }
};