"use strict";
//requires
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CreateError = require("http-errors");
var morgan = require("morgan");
const path = require('path')

const PORT = 4012;
/************************************************************************* */
// Import Routes
const Authenticate = require("./apps/routes/rAuthenticate");
const Loader = require("./apps/routes/rLoader");
const Attendance = require("./apps/routes/rAttendance");
const Report = require("./apps/routes/rReport")
const Employee = require("./apps/routes/rEmployee")
const Leaves = require("./apps/routes/rLeaves")
/************************************************************************** */

// Create the express app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(morgan("dev"));
app.use(express.static('/app/node/HRMS-APP/CDN'))
app.use(express.static('files'))
app.use('/static', express.static('/app/node/HRMS-APP/CDN'))
app.use('/static', express.static(path.join(__dirname, '/app/node/HRMS-APP/CDN')))
/*************************************************************************** */

//Routes
app.use("/auth", Authenticate);
app.use("/load", Loader);
app.use("/attendance", Attendance);
app.use("/report", Report);
app.use("/employee" , Employee )
app.use("/leave", Leaves)

app.use(morgan((tokens, req, res) => {
  return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
/************************************************************************* */

// Error handlers
// Define a middleware function that will be executed for any incoming HTTP requests
app.use((res, req, next) => {
  return next(CreateError(404, "Route Not Found!"));
});

//error handling middleware function
app.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    status: false,
    message: error.message,
  });
});
/********************************************************************************8 */

// Start server
app.listen(PORT, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log("Started at http://localhost:" + PORT);
});
