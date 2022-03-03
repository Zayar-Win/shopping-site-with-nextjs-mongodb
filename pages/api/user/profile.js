import bcrypt from "bcryptjs";
import nextConnect from "next-connect";
import User from "../../../models/User";
import {
  createToken,
  isAuth,
} from "../../../utils/auth";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nextConnect({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password;
    await user.save();
    await db.disconnect();

    const token = createToken(user);
    res.status(201).json({
      token,
      _id: user._id,
      email: user.email,
      name: user.name,
      is_Admin: user.is_Admin,
    });
  } else {
    res
      .status(404)
      .json({ message: "User not found" });
  }
});

export default handler;
