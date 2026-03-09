const jwt = require("jsonwebtoken");
const adminProtectRoute = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
  } catch (error) {}
};
