const express = require("express");
const Router = express.Router();
const co = require("co");
const service = require("../services/sLoader");

Router.post("/loader", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.Loader(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

module.exports = Router