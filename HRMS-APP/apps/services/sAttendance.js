const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qAttendance");

exports.getAttendance=co.wrap(async function (postParam){
  let queryResultObj = {};
  let resultObj = {};
  let mysqlDB;
  try {
    try {
      mysqlDB = await connection.getDB();
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAttendance-Loader10");
    }
    if(postParam.startDate && postParam.endDate){
      try {
      queryResultObj.attendance = await connection.query(mysqlDB, query.getAttendanceQuery, [postParam.startDate,postParam.endDate,postParam.empCode])
      } catch (error) {
        console.error(error)
        throw new Error("Internal Server Error sAttendance-Loader20");
      }
    }else if(postParam.month){
      queryResultObj.attendance=await connection.query(mysqlDB, query.getAttendanceQuerybyMonth, [postParam.month,postParam.empCode])

    }else if(postParam.curDate){
      queryResultObj.attendance=await connection.query(mysqlDB, query.getAttendanceQueryCurDate, [postParam.empCode])

    }else {
      try {
        queryResultObj.attendance = await connection.query(mysqlDB,query.getAttendanceQueryLastWeek,
          [postParam.empCode]
        );
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAttendance-Loader40");
      }
    }
    
    if (queryResultObj.attendance !== null && queryResultObj.attendance !== undefined) {
      resultObj.status = "success";
      resultObj.data = queryResultObj.attendance;
      return resultObj;
  }

    
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sAttendance-Loader40");
  } finally {
    mysqlDB.release()
  }
})

exports.Attendance = co.wrap(async function (postParam) {

  let queryResultObj = {};
  let resultObj = {};
  let mysqlDB;
  try {
    try {
      mysqlDB = await connection.getDB();
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAttendance-Loader10");
    }
    try {
      queryResultObj.checkValid = await connection.query(mysqlDB, query.checkValid, [postParam.UUID])
    } catch (error) {
      console.error(error)
      throw new Error("Internal Server Error sAttendance-Loader20");
    }
    

    if (queryResultObj.checkValid[0].count === 0) {
      resultObj.status = "error"
      resultObj.message = "Unregistered Device"
      return resultObj
    }

    if (queryResultObj.checkValid[0].count === 1) {
  
      try {
        queryResultObj.getCandidateId = await connection.query(mysqlDB, query.getCandidateId, [postParam.UUID])
      } catch (error) {
        console.error(error)
        throw new Error("Internal Server Error sAttendance-Loader20");
      }
      if (queryResultObj.getCandidateId !== null && queryResultObj.getCandidateId !== undefined && queryResultObj.getCandidateId.length > 0) {
        //check leave 
        try {
          queryResultObj.checkCurentDateLeave = await connection.query(mysqlDB, query.checkCurentDateLeaveQ, [queryResultObj.getCandidateId[0].empCode])
       console.log(queryResultObj.checkCurentDateLeave[0].count)
        } catch (error) {
          console.error(error)
          throw new Error("Internal Server Error sAttendance-Loader20");
        }

        if (queryResultObj.checkCurentDateLeave[0].count > 0) {
          resultObj.status = 'error'
          resultObj.message = 'You are on leave today'
          return resultObj
        }
        //
       
        try {
          queryResultObj.getAttendance = await connection.query(mysqlDB, query.getAttendance, [postParam.UUID])
          if (postParam.event === 0) {
         
            if (queryResultObj.getAttendance[0].count === 0) {
             
              try {
                queryResultObj.markAttendance = await connection.query(mysqlDB, query.markAttendance, [queryResultObj.getCandidateId[0].empCode, postParam.event, 1, null])
              } catch (error) {
                console.error(error)
                throw new Error("Internal Server Error sAttendance-Loader20");
              }
             
              resultObj.status = "success"
              resultObj.message = `Punch In Attendance Marked for ${new Date()}`
              return resultObj
            }
            if (queryResultObj.getAttendance[0].count >= 1) {
              resultObj.status = "error"
              resultObj.message = `Punch In Attendance Already Marked for today`
              return resultObj
            }
          } else if (postParam.event === 1) {
            if (queryResultObj.getAttendance[0].count === 1) {
              try {
                queryResultObj.markAttendance = await connection.query(mysqlDB, query.markAttendance, [queryResultObj.getCandidateId[0].empCode, postParam.event, postParam.outdoor, postParam.reason])
              } catch (error) {
                console.error(error)
                throw new Error("Internal Server Error sAttendance-Loader20");
              }
              resultObj.status = "success"
              resultObj.message = `Punch out Attendance Marked for ${new Date()}`
              return resultObj
            }
            if (queryResultObj.getAttendance[0].count >= 2) {
              resultObj.status = "error"
              resultObj.message = `Punch out Attendance Already Marked for today`
              return resultObj
            } else {
              resultObj.status = "error"
              resultObj.message = `Internal Server Error`
            }
          }
        } catch (error) {
          console.error(error)
          throw new Error("Internal Server Error sAttendance-Loader20");
        }
      }
    } else {
      resultObj.status = "error"
      resultObj.message = "Wrong Device!!"
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sAttendance-Loader40");
  } finally {
    mysqlDB.release()
  }
});
