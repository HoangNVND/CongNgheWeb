import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDB.js";
import ImportData from "./DataImport.js";
import productRouter from "./Routers/ProductRouters.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routers/UserRouters.js";
import orderRouter from "./Routers/orderRouters.js";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

//API
app.use("/api/import", ImportData);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("api/config/paypal", function (req, res) {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
//ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
