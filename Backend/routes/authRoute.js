const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  const data = req.body;
  console.log(data);
  console.log("dgaga");

  res.json({
    success: true,
    message: "Register route working",
  });
});

module.exports = router;
