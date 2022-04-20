import express, { raw } from "express";
import asyncHandler from "express-async-handler";
import Product from "../Models/ProductsModel.js";
import protect from "./../Middleware/AuthMiddleware.js";

const productRouter = express.Router();

//GET ALL PRODUCTS
productRouter.get(
  "/",
  asyncHandler(async function (req, res) {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
  })
);

//GET SINGLE PRODUCT
productRouter.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  })
);

// PRODUCT REVIEW
productRouter.post(
  "/:id/review",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Bạn đã đánh giá rồi !!!");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Cập nhật thành công đánh giá" });
    } else {
      res.status(404);
      throw new Error("Sản Phẩm không tồn tại !");
    }
  })
);
export default productRouter;
