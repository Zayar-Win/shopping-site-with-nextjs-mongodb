import Product from "../../../../models/Product";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const {
    method,
    query: { slug },
  } = req;
  if (method === "GET") {
    try {
      await db.connect();
      const product = await Product.findOne({
        slug,
      });
      await db.disconnect();

      return res.status(200).json(product);
    } catch (error) {
      res
        .status(500)
        .json({ message: "something wrong" });
    }
  }
};
export default handler;
