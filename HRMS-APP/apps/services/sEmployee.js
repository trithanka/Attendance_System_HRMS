const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qEmployee");

exports.getEmployeeDtl = co.wrap(async function (postParam) {
  console.log("post--------", postParam)
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
        queryResultObj = await connection.query(mysqlDB, query.getEmpDtl, [postParam.empId.replace('EMP00000','')]);
        console.log("her---------",queryResultObj)
      } catch (error) {
        console.error(error);
        console.error(error)
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
     
      if (queryResultObj !== null && queryResultObj !== undefined) {
          resultObj.status = "success";
          resultObj.data = queryResultObj[0];
          return resultObj;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader40");
    } finally {
      mysqlDB.release()
    }
  });