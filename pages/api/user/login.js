import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { createToken } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const { method } = req;
  if (method === "POST") {
    try {
      const email = req.body.email;
      await db.connect();
      const user = await User.findOne({ email });
      await db.disconnect();

      if (
        user &&
        bcrypt.compareSync(
          req.body.password,
          user.password
        )
      ) {
        const token = createToken(user);
        res.status(200).json({
          token,
          _id: user._id,
          name: user.name,
          email: user.email,
          is_Admin: user.is_Admin,
        });
      } else {
        res.status(401).json({
          message: "email or password invalid",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
