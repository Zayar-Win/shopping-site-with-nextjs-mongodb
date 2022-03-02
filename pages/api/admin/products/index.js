import nc from "next-connect";
import Product from "../../../../models/Product";
import {
  isAuth,
  isAdmin,
} from "../../../../utils/auth";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  console.log("hit");
  await db.connect();
  const newProduct = new Product({
    name: "new Product",
    slug: "new-slug-" + Math.random(),
    category: "new Category",
    image: "new Image",
    price: 0,
    brand: "new brand",
    countInStock: 0,
    description: "new Description",
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();
  await db.disconnect();
  res.status(201).json({
    message: "Create Product successful",
    product,
  });
});

export default handler;
