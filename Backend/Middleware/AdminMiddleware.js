const jwt = require("jsonwebtoken");
const protectAdminRoute = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectAdminRoute;
