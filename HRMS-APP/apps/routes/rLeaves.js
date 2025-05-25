const express = require("express");
const Router = express.Router();
const co = require("co");
const service = require("../services/sLeaves");
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './CDN/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Create the multer instance
  const upload = multer({ storage: storage });
  

Router.post("/leaves/check", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.LeavesCheck(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

Router.post("/leaves/header", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.LeavesHeader(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});


Router.post("/leaves/holidays", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.LeavesHolidays(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});


Router.post("/leaves/apply", upload.single('file'), (req, res) => {
    var result = [];
    co(async function () {
        console.log('request body', req.body)
        try {
            console.log(req.file)
            result = await service.ApplyLeave(req.body);
            res.send(result);
            console.log(result)
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

Router.post("/leaves/applied", (req, res) => {
    var result = [];
    co(async function () {
        try {
            result = await service.Applied(req.body);
            res.send(result);
        } catch (error) {
            console.log(error);
            result.message = error.message;
            res.send(error);
        }
    });
});

module.exports = Router