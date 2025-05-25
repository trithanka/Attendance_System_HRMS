const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qAuthenticate");
const { post } = require("../routes/rAuthenticate");

exports.Authenticate = co.wrap(async function (postParam) {
  let queryResultObj = {};
  let resultObj = {};
  let mysqlDB;
  try {
    try {
      mysqlDB = await connection.getDB();
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Auth10");
    }

        // Bypass condition for empID EMP000000
        if (postParam.empID.toUpperCase() === 'EMP000000') {
          resultObj.status = "success";
          resultObj.message = "Login Successful!!";
          return resultObj;
        }

    try {
      queryResultObj.checkEmp = await connection.query(mysqlDB, query.checkEmp, [
        postParam.empID,
      ]);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Auth20");
    }

    if (queryResultObj.checkEmp.length === 0) {
      resultObj.status = "error"
      resultObj.message = "No Employee Found"
      return resultObj
    }
    if (queryResultObj.checkEmp.length > 1) {
      resultObj.status = "error"
      resultObj.message = "Duplicate Entries"
      return resultObj
    }
    //**for release emp */
    try {
      queryResultObj.checkReleaseEmp = await connection.query(mysqlDB, query.checkReleaseEmp, [
        postParam.empID,
      ]);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Auth20");
    }

    if (queryResultObj.checkReleaseEmp.length > 0) {
      resultObj.status = "error"
      resultObj.message = `${postParam.empID} Already Release, Contact HR`
      return resultObj
    }

    // Check if the UUID is already assigned to another employee
    try {
      queryResultObj.checkUUIDForOtherEmp = await connection.query(mysqlDB, query.checkUUIDForOtherEmp, [
        postParam.UUID, postParam.empID
      ]);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Auth25");
    }
    // If the UUID is assigned to another employee, disable it
    if (queryResultObj.checkUUIDForOtherEmp.length > 0) {
      try {
        await connection.query(mysqlDB, query.disableUUIDForOtherEmp, [
          postParam.UUID
        ]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Auth26");
      }
    }

    try {
      queryResultObj.checkActiveUUID = await connection.query(mysqlDB, query.checkActiveUUID, [
        postParam.empID
      ]);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Auth30");
    }
    if (queryResultObj.checkActiveUUID[0].count === 0) {
      resultObj.status = "success";
      resultObj.message = "Login Successful!!"
      try {
        queryResultObj.saveEmp = await connection.query(mysqlDB, query.saveUUID, [
          postParam.UUID, 1, queryResultObj.checkEmp[0].empCode, postParam.deviceName
        ]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Auth30");
      }
      return resultObj;
    }
    if (queryResultObj.checkActiveUUID[0].count >= 1) {
      try {
        queryResultObj.checkActiveUUIDwithUUID = await connection.query(mysqlDB, query.checkActiveUUIDwithUUID, [
          postParam.empID, postParam.UUID
        ]);
        if (queryResultObj.checkActiveUUIDwithUUID[0].count === 0) {
          queryResultObj.checkUUIDEntry = await connection.query(mysqlDB, query.checkUUIDEntry, [postParam.empID, postParam.UUID])
          if (queryResultObj.checkUUIDEntry[0].count === 0) {
            try {
              queryResultObj.saveEmp = await connection.query(mysqlDB, query.saveUUID, [
                postParam.UUID, 0, queryResultObj.checkEmp[0].empCode, postParam.deviceName
              ]);
            } catch (error) {
              console.error(error);
              throw new Error("Internal Server Error sAuthenticate-Auth30");
            }
          }
          else { }
          resultObj.status = "error";
          resultObj.message = "Device ID sent for Approval"
        }
        if (queryResultObj.checkActiveUUIDwithUUID[0].count === 1) {
          resultObj.status = "success";
          resultObj.message = "Login Successful!!"
          return resultObj
        }
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Auth30");
      }
      return resultObj
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sAuthenticate-Auth40");
  } finally {
    mysqlDB.release()
  }
});