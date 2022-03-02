import nextConnect from "next-connect";
import Order from "../../../../models/Order";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";

const handler = nextConnect({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(
    req.query.id
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const newOrder = await order.save();
    await db.disconnect();
    res.status(200).json(newOrder);
  } else {
    res
      .status(404)
      .json({ message: "Order not found" });
  }
});

export default handler;
