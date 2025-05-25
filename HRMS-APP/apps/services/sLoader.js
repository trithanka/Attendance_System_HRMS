const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qLoader");

exports.Loader = co.wrap(async function (postParam) {


    let queryResultObj = {};
    let resultObj = {};
    let mysqlDB;
    try {
      try {
        mysqlDB = await connection.getDB();
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader10");
      }
     
      try {
        queryResultObj.loginTime = await connection.query(mysqlDB, query.loginTime, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
   
      try {
        queryResultObj.personal = await connection.query(mysqlDB, query.personal, [postParam.empId.replace('EMP00000','')]);
      
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
      console.log("here--------1", postParam.empId.replace('EMP00000',''))
      if (queryResultObj.personal === null || queryResultObj.personal === undefined || queryResultObj.personal.length === 0 ) {
        resultObj.message = "Personal Details is not associated with your account. Kindly Contact HR Admin"
        resultObj.status = "failed";
        return resultObj;
      }
      console.log("here--------2")
      try {
        queryResultObj.inOut = await connection.query(mysqlDB, query.inOut, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }

      if (queryResultObj.inOut === null || queryResultObj.inOut === undefined || queryResultObj.inOut.length === 0 ) {
        resultObj.message = "Personal Details is not associated with your account. Kindly Contact HR Admin"
        resultObj.status = "failed";
        return resultObj;
      }
      if (queryResultObj.inOut === null || queryResultObj.inOut === undefined || queryResultObj.inOut.length === 0 ) {
        resultObj.message = "Personal Details is not associated with your account. Kindly Contact HR Admin"
        resultObj.status = "failed";
        return resultObj;
      }

      try {
        queryResultObj.outIn = await connection.query(mysqlDB, query.outIn, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }

      if (queryResultObj.outIn === null || queryResultObj.outIn === undefined || queryResultObj.outIn.length === 0 ) {
        resultObj.message = "Personal Details is not associated with your account. Kindly Contact HR Admin"
        resultObj.status = "failed";
        return resultObj;
      }
   
      try {
        queryResultObj.coordinates = await connection.query(mysqlDB, query.getCoordinates, [postParam.empId.replace('EMP00000','')]);
        console.log(queryResultObj.coordinates)
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }

      if (queryResultObj.coordinates === null || queryResultObj.coordinates === undefined || queryResultObj.coordinates.length === 0 ) {
        resultObj.message = "Location is not associated with your account. Kindly Contact HR Admin"
        resultObj.status = "failed";
        return resultObj;
      }


      try {
        queryResultObj.responsibility = await connection.query(mysqlDB, query.responsibility, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }

      try {
        queryResultObj.responsibilityOTP = await connection.query(mysqlDB, query.responsibilityOTP, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
      resultObj.notification = []
      for(let i = 0; i < queryResultObj.responsibility.length; i++){
        resultObj.notification.push(`You have been given temporary oversight by ${queryResultObj.responsibility[i].leaveTaker} on date(s) ${ queryResultObj.responsibility[i].leaveDates}`)
      }

      for(let i = 0; i < queryResultObj.responsibilityOTP.length; i++){
        resultObj.notification.push(`OTP for leave of ${queryResultObj.responsibilityOTP[i].name} is ${queryResultObj.responsibilityOTP[i].otp} `)
      }
      
      try {
        queryResultObj.dateTime = await connection.query(mysqlDB, query.getDatetime, []);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader30");
      }
      try {
        queryResultObj.attendanceTime = await connection.query(mysqlDB, query.getAttendanceTime, [postParam.empId.replace('EMP00000','')]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader30");
      }

      if (queryResultObj !== null && queryResultObj !== undefined) {
        resultObj.coordinates = queryResultObj.coordinates[0]
        resultObj.personal = queryResultObj.personal[0]
        resultObj.dateTime = queryResultObj.dateTime[0]
        resultObj.loginTime = queryResultObj.loginTime.length === 0 ? null : queryResultObj.loginTime[0].time 
        resultObj.isPunchedIn = queryResultObj.inOut[0].count
        resultObj.isPunchedOut = queryResultObj.outIn[0].count
        if (queryResultObj.attendanceTime.length > 0) {
          resultObj.attendanceTime = queryResultObj.attendanceTime[0];
      } else {
          resultObj.attendanceTime = {
              date: "",
              time: "",
              inTime: "",
              outTime: "",
              attendanceMarkerIn: "",
              attendanceMarkerOut: ""
          };
      }
        // resultObj.timeConstraint = queryResultObj.timeConstraint[0]
        resultObj.status = "success";
     
        return resultObj;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader40");
    } finally {
      mysqlDB.release()
    }
  });