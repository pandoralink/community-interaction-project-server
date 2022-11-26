const express = require("express");
const router = express.Router();

router.get("/v", (req, res) => {
  res.send("v4");
});

module.exports = router;