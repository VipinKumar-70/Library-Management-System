require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const adminProfile = require("./routes/adminProfile");
const adminRoute = require("./routes/adminRoute");
const profile = require("./routes/studentProfile");
const uploadbook = require("./routes/BookRoute");
const cookieParser = require("cookie-parser");
const borrowRoute = require("./routes/borrowRoute");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const startServer = async () => {
  try {
    await connectDB();
    app.use("/api", authRoute);
    app.use("/api", profile);
    app.use("/admin", adminRoute);
    app.use("/admin", adminProfile);
    app.use("/books", uploadbook);
    app.use("/borrow", borrowRoute);
    app.use("/api/recommend", require("./routes/recommendRoutes"));
    app.use("/api/analytics", require("./routes/analyticsRoute"));
    

    app.get("/api/test", (req, res) => {
      res.json({ message: "Backend connected" });
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
