const messageService = require("../services/messageService");

exports.send = (req, res) => {
  messageService.send(req, res);
};

exports.getClients = (req, res) => {
  messageService.getClients(req, res);
};
