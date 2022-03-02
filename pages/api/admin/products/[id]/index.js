import nextConnect from "next-connect";
import { onError } from "../../../../../utils/error";
import {
  isAuth,
  isAdmin,
} from "../../../../../utils/auth";
import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(
    req.query.id
  );
  await db.disconnect();
  res.status(200).json(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(
    req.query.id
  );
  if (product) {
    console.log("hit");
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    db.disconnect();
    res
      .status(201)
      .json({ message: "Update Successful" });
  } else {
    res
      .status(401)
      .json({ message: "Product not found" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(
    req.query.id
  );
  if (product) {
    product.remove();
    await db.disconnect();
    res.status(201).json({
      message: "Product delete successful",
    });
  } else {
    res
      .status(404)
      .json({ message: "Product Not found!!!" });
  }
});

export default handler;
