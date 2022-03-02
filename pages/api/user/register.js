import bcrypt from "bcryptjs";
import db from "../../../utils/db";
import User from "../../../models/User";
import { createToken } from "../../../utils/auth";

const handler = async (req, res) => {
  const { method } = req;
  if (method === "POST") {
    try {
      db.connect();
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password
        ),
        is_Admin: false,
      });
      const user = await newUser.save();
      db.disconnect();
      const token = createToken(user);
      res.status(200).json({
        token,
        name: user.name,
        email: user.email,
        is_Admin: user.is_Admin,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
