import { findAll, create, searchByName } from "../models/Product.js";

export async function getAllProducts(req, res) {
  console.log("getAllProducts...");
  const products = await findAll();
  res.json(products);
}

export async function createProduct(req, res) {
  const { name, stock, location } = req.body;
  // const product = await create({ name, stock, location });
  const product = await create({ name, stock, location });
  res.json(product);
}

export async function searchProducts(req, res) {
  const { filter } = req.query;
  const products = await searchByName(filter);
  res.json(products);
}