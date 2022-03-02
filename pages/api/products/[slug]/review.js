import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import mongoose from "mongoose";

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(
    req.query.slug
  );
  db.disconnect();
  if (product) {
    res.status(200).json(product.reviews);
  } else {
    res
      .status(404)
      .json({ message: "Product not found" });
  }
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();
  const product = await Product.findById(
    req.query.slug
  );
  if (product) {
    const existReview = product.reviews.find(
      (x) => x.user == req.user._id
    );
    if (existReview) {
      console.log(existReview._id);
      await Product.updateOne(
        {
          _id: req.query.slug,
          "reviews._id": existReview._id,
        },
        {
          $set: {
            "reviews.$.comment": req.body.comment,
            "reviews.$.rating": Number(
              req.body.rating
            ),
          },
        }
      );
      const updateProduct =
        await Product.findById(req.query.slug);
      updateProduct.numReviews =
        updateProduct.reviews.length;
      updateProduct.rating =
        updateProduct.reviews.reduce(
          (a, c) => c.rating + a,
          0
        ) / updateProduct.reviews.length;
      await updateProduct.save();
      await db.disconnect();
      res
        .status(201)
        .json({ message: "Review Submit" });
      console.log("hit");
    } else {
      const review = {
        user: mongoose.Types.ObjectId(
          req.user._id
        ),
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce(
          (a, c) => c.rating + a,
          0
        ) / product.reviews.length;
      await product.save();
      db.disconnect();
      res
        .status(201)
        .json({ message: "Review Submit" });
    }
  } else {
    res
      .status(404)
      .json({ message: "Product Not found!!!" });
  }
});

export default handler;
