import nextConnect from "next-connect";
import { onError } from "../../../utils/error";
import {
  isAdmin,
  isAuth,
} from "../../../utils/auth";
import db from "../../../utils/db";
import Order from "../../../models/Order";

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find().populate(
    "user"
  );
  await db.disconnect();
  res.status(200).json(orders);
});

export default handler;
