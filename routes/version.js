const express = require("express");
const router = express.Router();

router.get("/v", (req, res) => {
  res.send("v1");
});

module.exports = router;