const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qReport");

exports.Report = co.wrap(async function (postParam) {
    let queryResultObj = {};
    let resultObj = {};
    let mysqlDB;
    try {
      try {
        mysqlDB = await connection.getDB();
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Report10");
      }
      try {
      queryResultObj.attendance = await connection.query(mysqlDB, query.attendanceReport, [postParam.UUID])
      } catch(error){
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Report20");
      }
      if(queryResultObj.attendance !== null && queryResultObj.attendance !== undefined && queryResultObj.attendance.length > 0) {
        resultObj.status = "success"
        resultObj.message = "Fetching!!"
        resultObj.data = queryResultObj.attendance
        resultObj.file = json
        return resultObj
      } else {
        resultObj.status = "error"
        resultObj.message = "No attendance details found!!"
        return resultObj
      }

    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Report40");
    } finally {
      mysqlDB.release()
    }
  });