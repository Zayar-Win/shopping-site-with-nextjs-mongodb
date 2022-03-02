import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const { method } = req;
  if (method === "GET") {
    try {
      await db.connect();
      const products = await Product.find();
      await db.disconnect();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
