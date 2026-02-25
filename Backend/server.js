require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const profile = require("./routes/profile");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

connectDB();

app.use("/api", authRoute);
app.use("/api", profile);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
