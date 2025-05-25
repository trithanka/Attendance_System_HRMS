const express = require("express");
const Router = express.Router();
const co = require("co");
const service = require("../services/sReport");

Router.post("/Report", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.Report(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

module.exports = Router