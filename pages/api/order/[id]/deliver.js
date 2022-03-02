import nextConnect from "next-connect";
import Order from "../../../../models/Order";
import {
  isAdmin,
  isAuth,
} from "../../../../utils/auth";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(
    req.query.id
  );
  if (!order) {
    res
      .status(404)
      .json({ message: "Order not found" });
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const newOrder = await order.save();
  await db.disconnect();
  res.status(201).json({
    message: "Order Delivered",
    newOrder,
  });
});

export default handler;
