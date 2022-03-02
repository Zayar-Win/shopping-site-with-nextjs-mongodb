import nextConnect from "next-connect";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";
import Product from "../../../models/Product";

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const categories =
    await Product.find().distinct("category");
  await db.disconnect();
  res.send(categories);
});

export default handler;
