import { DataTypes, Op } from "sequelize";
import sequelize from "../config/db.js"


const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stocked: { type: DataTypes.BOOLEAN, defaultValue: true }
  // 필요시 createdAt, updatedAt 자동 생성됨
}, {
  timestamps: false // createdAt, updatedAt 필드 자동 생성
});

export const findAll = async () => {
  return await Product.findAll();
}

export const create = async (name, stock, location) => {
  return await Product.create(name, stock, location);
}

export const searchByName = async (name) => {
  return await Product.findAll({
    where: {
      name: {
        [Op.like]: `${name}%`
      }
    }
  });
}

export default Product;