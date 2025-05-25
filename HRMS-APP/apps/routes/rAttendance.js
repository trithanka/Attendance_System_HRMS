const express = require("express");
const Router = express.Router();
const co = require("co");
const service = require("../services/sAttendance");

Router.post("/attendance", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.Attendance(req.body);
            console.log(result)
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});
Router.post("/get", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.getAttendance(req.body);
            console.log(result)
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

module.exports = Router