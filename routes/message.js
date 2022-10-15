const express = require("express");
const { send, getClients } = require("../controllers/messageController");
const router = express.Router();
const expressJoi = require("../schemas/express-joi");
const { sendSchema } = require("../schemas/messageSchema");

router.post("/send", expressJoi(sendSchema), send);

// NOTE: 生产版本需要删除
router.get("/getClients", getClients);

module.exports = router;
