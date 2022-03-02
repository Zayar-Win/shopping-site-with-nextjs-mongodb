import Product from "../../models/Product";
import User from "../../models/User";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = async (req, res) => {
  const { method } = req;
  if (method === "GET") {
    try {
      await db.connect();
      await Product.deleteMany();
      await Product.insertMany(data.products);
      await User.deleteMany();
      await User.insertMany(data.users);
      await db.disconnect();
      res.status(200).json({
        message: "seeded successful!!!",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
