const express = require("express");
const router = express.Router();

router.get("/v", (req, res) => {
  res.send("v5");
});

module.exports = router;