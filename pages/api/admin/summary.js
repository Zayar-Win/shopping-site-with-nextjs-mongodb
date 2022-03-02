import nextConnect from "next-connect";
import { onError } from "../../../utils/error";
import {
  isAdmin,
  isAuth,
} from "../../../utils/auth";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orderCount = await Order.countDocuments();
  const productCount =
    await Product.countDocuments();
  const userCount = await User.countDocuments();
  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const orderPrice =
    orderPriceGroup.length > 0
      ? orderPriceGroup[0].sales
      : 0;
  const saleData = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  await db.disconnect();
  res.status(200).json({
    productCount,
    orderCount,
    userCount,
    orderPrice,
    saleData,
  });
});

export default handler;
