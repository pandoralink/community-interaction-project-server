const express = require("express");
const router = express.Router();

router.get("/v", (req, res) => {
  res.send("v3");
});

module.exports = router;