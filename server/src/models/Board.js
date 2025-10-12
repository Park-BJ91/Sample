import { mariadbSequelize } from '../config/mariadb.js';
import { DataTypes, Sequelize } from 'sequelize';



/* 
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL, -- Quill HTML로 저장
    view_count INT DEFAULT 0, 
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
*/

/* 
CREATE TABLE board_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    board_id BIGINT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    status ENUM('temp', 'confirmed', 'deleted') DEFAULT 'temp',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

/*
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

*/

/*
CREATE TABLE board_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (board_id, user_id)
);
*/

/** Board Model */
export const Board = mariadbSequelize.define('Board', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
}, {
    tableName: 'board',
    timestamps: false,
});

/** BoardImage Model */
export const BoardImage = mariadbSequelize.define('BoardImage', {
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
export const Comment = mariadbSequelize.define('Comment', {
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
export const BoardLike = mariadbSequelize.define('BoardLike', {
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
    const t = await mariadbSequelize.transaction();
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


/* BoardImage  */

/** BoardImage 생성 */
export const addBoardImage = async (imageData) => {
    const t = await mariadbSequelize.transaction();
    try {
        const image = await BoardImage.create(imageData, { transaction: t });
        await t.commit();
        return image;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};


/* Comment  */
export const addComment = async (commentData) => {
    const t = await mariadbSequelize.transaction();
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
    const t = await mariadbSequelize.transaction();
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
    const t = await mariadbSequelize.transaction();
    try {
        const result = await BoardLike.destroy({ where: { boardId, userId }, transaction: t });
        await t.commit();
        return result; // 삭제된 행의 수 반환
    } catch (error) {
        await t.rollback();
        throw error;
    }
};