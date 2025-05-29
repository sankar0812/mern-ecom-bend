const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverless = require("serverless-http");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// mongoose
//   .connect("mongodb+srv://sankar:Sankar%40001@mern.izmru.mongodb.net/ecommerce")
//   .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.log(error));

const app = express();

// // Reuse DB connection between invocations
// let isConnected = false;

// async function connectToDatabase() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://sankar:Sankar%40001@mern.izmru.mongodb.net/ecommerce", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     isConnected = true;
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// }

// ✅ Reuse connection for performance in Vercel
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://sankar:Sankar%40001@mern.izmru.mongodb.net/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

// ✅ Export as serverless handler with DB connect
const handler = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

module.exports.handler = serverless(handler);

const allowedOrigins = ["http://localhost:5173", "https://vizosmern.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

module.exports = serverless(app);


if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
  });
}
