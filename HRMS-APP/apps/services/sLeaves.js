const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const query = require("../queries/qLeaves");
const { end } = require("../../JOS/DALMYSQL");
const moment = require('moment');
const { post } = require("request");
const { toBase64 } = require("request/lib/helpers");
const base64 = require('js-base64')
const fs = require('fs')

exports.LeavesCheck = co.wrap(async function (postParam) {
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
      queryResultObj.leavesCheck = await connection.query(mysqlDB, query.leavesCheck, [postParam.empId.replace('EMP00000', ''), new Date().getFullYear()]);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }

    if (queryResultObj.leavesCheck === null || queryResultObj.leavesCheck === undefined || queryResultObj.leavesCheck.length === 0) {
      resultObj.message = "No Leaves associated with your account"
      resultObj.status = "failed";
      return resultObj;
    }


    if (queryResultObj !== null && queryResultObj !== undefined) {
      resultObj.leaves = queryResultObj.leavesCheck[0];
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

exports.LeavesHeader = co.wrap(async function (postParam) {
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
      queryResultObj.leavesHeader = await connection.query(mysqlDB, query.leavesHeader, []);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }

    try {
      queryResultObj.leavesResponsibility = await connection.query(mysqlDB, query.leavesResponsibility, []);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }

    if (queryResultObj.leavesHeader === null || queryResultObj.leavesHeader === undefined || queryResultObj.leavesHeader.length === 0) {
      resultObj.status = "failed";
      return resultObj;
    }


    if (queryResultObj !== null && queryResultObj !== undefined) {
      resultObj.leavesResponsibility = queryResultObj.leavesResponsibility
      resultObj.leavesHeader = queryResultObj.leavesHeader;
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

exports.LeavesHolidays = co.wrap(async function (postParam) {
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
      queryResultObj.holidays = await connection.query(mysqlDB, query.holidays, []);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }

    if (queryResultObj.holidays === null || queryResultObj.holidays === undefined || queryResultObj.holidays.length === 0) {
      resultObj.message = "No Leaves associated with your account"
      resultObj.status = "failed";
      return resultObj;
    }


    if (queryResultObj !== null && queryResultObj !== undefined) {
      resultObj.leaves = queryResultObj.holidays;
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

// exports.ApplyLeave = co.wrap(async function (postParam) {
//     let queryResultObj = {};
//     let resultObj = {};
//     let mysqlDB;
//     let diffDays;
//     let pre = [];
//     let suf = [];
//     let inf = [];
//     let applied = []
//     let consPre = 0;
//     let consSuf = 0;
//     const date = new Date().toISOString()

//     try {
//       try {
//         mysqlDB = await connection.getDB();
//       } catch (error) {
//         console.error(error);
//         throw new Error("Internal Server Error sAuthenticate-Loader10");
//       }

//       try{
//         queryResultObj.alreadyInPendingLeave = await connection.query(mysqlDB, query.alreadyInPendingLeaveQ, [postParam.empId.replace("EMP00000", ""),])

//       } catch(error) {
//         console.error(error);
//         throw new Error("Internal Server Error sAuthenticate-Loader20");
//     }
//     if(queryResultObj.alreadyInPendingLeave.count > 0) {
//       resultObj.status = 'error'
//       resultObj.message = 'Your privous leave request in pending'
//     }

//     try{
//       queryResultObj.alreadyTakeLeave = await connection.query(mysqlDB, query.alreadyTakeLeaveQ, [postParam.fromDate, postParam.empId.replace("EMP00000", ""),])

//     } catch(error) {
//       console.error(error);
//       throw new Error("Internal Server Error sAuthenticate-Loader20");
//   }
//   if(queryResultObj.alreadyTakeLeave.count > 0) {
//     resultObj.status = 'error'
//     resultObj.message = `You are already on leave ${postParam.fromDate} date`
//   }

//     if(postParam.leaveType == 'CL'){
//         try {
//             queryResultObj.holidaysinBetweenLeave = await connection.query(mysqlDB, query.holidaysinBetweenLeave, [postParam.fromDate, postParam.toDate]);
//             queryResultObj.holidaysinBetweenLeaveList = await connection.query(mysqlDB, query.holidaysinBetweenLeaveList, [postParam.fromDate, postParam.toDate]);
//         } catch(error) {
//             console.error(error);
//             throw new Error("Internal Server Error sAuthenticate-Loader20");
//         }
//         try{
//             const startDate = new Date(postParam.fromDate);
//             const endDate = new Date(postParam.toDate );
//             const diffTime = Math.abs(endDate - startDate);
//             diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 - (queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays : 0); 
//             presuf = 7-diffDays-queryResultObj.holidaysinBetweenLeave[0].holidays

//             queryResultObj.checkPrefixHolidays = await connection.query(mysqlDB, query.checkPrefixHolidays, [moment(postParam.fromDate, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'), postParam.fromDate]);
//             queryResultObj.checkSuffixHolidays = await connection.query(mysqlDB, query.checkSuffixHolidays, [postParam.toDate, moment(postParam.toDate, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD')]);

//             for(let i = 0; i < queryResultObj.checkPrefixHolidays.length; i++) {
//                 pre.push( new Date(queryResultObj.checkPrefixHolidays[i].holidays))
//             }
//             pre.push(new Date(postParam.fromDate))
//             suf.push(new Date(postParam.toDate))
//             for(let i = 0; i < queryResultObj.checkSuffixHolidays.length; i++) {
//                 suf.push( new Date(queryResultObj.checkSuffixHolidays[i].holidays))
//             }
//             for(let i = pre.length; i > 1; i--) {
//                let diffTimePre = Math.abs(pre[i-1] - pre[i-2]);
//                let diffDaysPre = Math.ceil(diffTimePre / (1000 * 60 * 60 * 24)) - 1
//                 if(diffDaysPre === 0){
//                     consPre = consPre + 1
//                 } else if (diffDaysPre === 1) {
//                     i = 1
//                 }
//             }
//             for(let i = 0; i < suf.length-1; i++) {
//               let diffTimeSuf = Math.abs(suf[i+1] - suf[i]);
//               let diffDaysSuf = Math.ceil(diffTimeSuf / (1000 * 60 * 60 * 24))-1
//                 if(diffDaysSuf === 0){
//                     consSuf = consSuf + 1
//                 } else {
//                     i = suf.length-1
//                 }
//             }
//         } catch(error){
//             console.error(error);
//             throw new Error("Internal Server Error sAuthenticate-Loader20");
//         }
//             if(true) {
//               if(diffDays === 0 || diffDays + queryResultObj.holidaysinBetweenLeave[0].holidays + consPre + consSuf > 7 || diffDays > 3){
//                   resultObj.status = "error";
//                   resultObj.message = "Conditions Not matched"
//               } else {
//                 const fromDateAdjusted = moment(postParam.fromDate).add(1, 'day').format('YYYY-MM-DD');
//                 const toDateAdjusted = moment(postParam.toDate).add(1, 'day').format('YYYY-MM-DD');

//         for (let i = fromDateAdjusted; i <= toDateAdjusted; i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')) {
//           if (!inf.includes(i)) {
//               applied.push(i);
//           }
//       }
//                   for(let i = 0; i < applied.length; i++){
//                       queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), applied[i], 0, new Date(), applied.length, postParam.reason, "CL", postParam.header, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
//                   }
//                   if(queryResultObj.applyForLeave.insertId !== null && queryResultObj.applyForLeave.insertId !== undefined) {
//                        resultObj.message = `Applied Successfully For Dates ${applied}`
//                       resultObj.message = `Leave Applied Successfully`
//                       resultObj.status = "success"
//                   } else {
//                     resultObj.message = `Application Failed`
//                     resultObj.status = "error"
//                   }
//               }
//             } 

//             if (diffDays === 0) {
//                 resultObj.leaveDays = 0
//                 resultObj.LWPDays = 0
//                 resultObj.infix =queryResultObj.holidaysinBetweenLeave[0].holidays
//                 resultObj.prefix =consPre
//                 resultObj.suffix =consSuf
//                 resultObj.message = `Your leave falls on a holiday, No need to apply`
//                 resultObj.status = "error"
//             } else if(diffDays + queryResultObj.holidaysinBetweenLeave[0].holidays + consPre + consSuf > 7) {
//                 resultObj.leaveDays = diffDays 
//                 resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
//                 resultObj.prefix =consPre
//                 resultObj.suffix =consSuf
//                 resultObj.message = `Leave at a stretch extends more than 7 days`
//                 resultObj.status = "error"
//             } else if(diffDays > 3) {
//                 resultObj.leaveDays = diffDays
//                 resultObj.LWPDays = diffDays-3
//                 resultObj.infix =queryResultObj.holidaysinBetweenLeave[0].holidays
//                 resultObj.prefix =consPre
//                 resultObj.suffix =consSuf
//                 resultObj.message = `You cannot apply more than 3 days casual leave at once. ${diffDays -3 > 1 ? diffDays -3 + ' days' : '1 day' } will be counted as LWP.`
//                 resultObj.status = "error"
//             } else {

//                 resultObj.leaveDays = diffDays
//                 resultObj.LWPDays = 0
//                 resultObj.prefix = consPre
//                 resultObj.suffix = consSuf
//                 resultObj.infix =queryResultObj.holidaysinBetweenLeave[0].holidays
//                 resultObj.message = `Leave Applied Successfully`
//                 resultObj.status = "success"
//             }

//     } else if(postParam.leaveType == 'ML'){
//         try {
//             queryResultObj.holidaysinBetweenLeave = await connection.query(mysqlDB, query.holidaysinBetweenLeave, [postParam.fromDate, postParam.toDate]);
//             queryResultObj.holidaysinBetweenLeaveList = await connection.query(mysqlDB, query.holidaysinBetweenLeaveList, [postParam.fromDate, postParam.toDate]);
//         } catch(error) {
//             console.error(error);
//             throw new Error("Internal Server Error sAuthenticate-Loader20");
//         }
//         try {
//             const startDate = new Date(postParam.fromDate);
//             const endDate = new Date(postParam.toDate);
//             const diffTime = Math.abs(endDate - startDate);
//             diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 - (queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays : 0); 
//         } catch (error) {

//         }
//               try{
//                 const fromDateAdjusted = moment(postParam.fromDate).add(1, 'day').format('YYYY-MM-DD');
//                 const toDateAdjusted = moment(postParam.toDate).add(1, 'day').format('YYYY-MM-DD');

//                   for (let i = fromDateAdjusted; i <= toDateAdjusted; i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')) {
//                     if (!inf.includes(i)) {
//                         applied.push(i);
//                     }
//                 }
//                   for(let i = 0; i < applied.length; i++){
//                       queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), applied[i], 0, new Date(), applied.length, postParam.reason, "ML", postParam.headers, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
//                   }
//                   if(queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
//                        resultObj.message = `Applied Successfully For Dates ${applied}`
//                       resultObj.message = `Leave Applied Successfully`
//                       resultObj.status = "success"
//                   }
//                 } catch(error){
//                   console.error(error)
//                   throw new Error('Error in Applying Leave')
//                 }
//             resultObj.leaveDays = diffDays
//             resultObj.LWPDays = 0
//             resultObj.infix =queryResultObj.holidaysinBetweenLeave[0].holidays
//             resultObj.status = "success"

//     } else if(postParam.leaveType == 'PL'){
//         try {
//         } catch (error) {
//           console.error(error)
//           throw new Error('Error in Applying Leave')
//         }
//               try{
//                 const fromDateAdjusted = moment(postParam.fromDate).add(1, 'day').format('YYYY-MM-DD');
//                 const toDateAdjusted = moment(postParam.toDate).add(1, 'day').format('YYYY-MM-DD');

//                 queryResultObj.gender = await connection.query(mysqlDB, query.gender, [postParam.empId.replace("EMP00000", "")])

//                 if(queryResultObj.gender[0].gender == 1) {
//                   queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForParentalLeaveMale, [postParam.empId.replace("EMP00000", ""), fromDateAdjusted, toDateAdjusted, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
//                   if(queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
//                     resultObj.message = `Leave Applied Successfully`
//                     resultObj.status = "success"
//                 }
//                 } else if(queryResultObj.gender[0].gender == 2) {
//                   queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForParentalLeaveFemale, [postParam.empId.replace("EMP00000", ""), fromDateAdjusted, toDateAdjusted, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
//                   if(queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
//                     resultObj.message = `Leave Applied Successfully`
//                     resultObj.status = "success"
//                 }
//                 } else {
//                     resultObj.message = `You are not eligible for parental leave`
//                     resultObj.status = "error"
//                 }

//                 }catch(error){
//                   console.error(error)
//                   throw new Error('Error in Applying Leave')
//                 }

//             resultObj.leaveDays = diffDays
//             resultObj.message = `Leave Applied Successfully`
//             resultObj.status = "success"

//     } else if(postParam.leaveType == 'RH'){
//       try {
//          // console.log(postParam)
//       } catch (error) {
//         console.error(error)
//         throw new Error('Error in Applying Leave')
//       }
//           let leaveDate = new Date(postParam.fromDate);

//             try {
//               queryResultObj.previousRHCurrentMonth = await connection.query(mysqlDB, query.previousRHCurrentMonth, [leaveDate])
//             } catch (error) {
//               console.error(error)
//               throw new Error('Error in Applying Leave')
//             }
//             try {
//               queryResultObj.previousRHCurrentYear = await connection.query(mysqlDB, query.previousRHCurrentYear, [leaveDate])
//             } catch (error) {
//               console.error(error)
//               throw new Error('Error in Applying Leave')
//             }
//             if(queryResultObj.previousRHCurrentYear[0].count < 2 ){
//               if(queryResultObj.previousRHCurrentMonth[0].count === 0){
//                 queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), leaveDate, 0, new Date(), 1, postParam.reason, "RH", postParam.header, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
//                 if(queryResultObj.applyForLeave.insertId !== null && queryResultObj.applyForLeave.insertId !== undefined) {
//                     resultObj.message = `Applied Successfully For Dates ${applied}`
//                     resultObj.message = `Leave Applied Successfully`
//                     resultObj.status = "success"
//                 } else {
//                   resultObj.message = `Application Failed`
//                   resultObj.status = "error"
//                 }
//               } else {
//                 resultObj.message = "You have already applied a restricted holiday this month"
//                 resultObj.status = "error"
//               }
//             } else {
//               resultObj.message = "You have already applied 2 restricted holidays this year"
//               resultObj.status = "error"
//             }

//         leaveDate = new Date(postParam.fromDate);
//           try {
//             queryResultObj.restrictedHolidays = await connection.query(mysqlDB, query.restrictedHolidays, [leaveDate])
//           } catch (error) {
//             console.error(error)
//             throw new Error (`Error in Applying Leave`)
//           }

//           if(queryResultObj.restrictedHolidays !== null && queryResultObj.restrictedHolidays !== undefined && queryResultObj.restrictedHolidays.length > 0) {
//             resultObj.message =  `You have Applied for Restricted Holiday for ${queryResultObj.restrictedHolidays[0].holiday}. Please Confirm`
//             resultObj.status =  "success" 
//           } else {
//             resultObj.message =  `Error in Applying Leave. No Restricted Holiday Available`
//             resultObj.status =  "error" 
//           }

//   }

//     if (queryResultObj !== null && queryResultObj !== undefined) {
//         return resultObj;
//     }
//     } catch (error) {
//       console.error(error);
//       throw new Error("Internal Server Error sAuthenticate-Loader40");
//     } finally {
//       mysqlDB.release()
//     }
// });

exports.ApplyLeave = co.wrap(async function (postParam) {
 console.log("postParam---", postParam)
  let queryResultObj = {};
  let resultObj = {};
  let mysqlDB;
  let diffDays;
  let pre = [];
  let suf = [];
  let inf = [];
  let applied = []
  let consPre = 0;
  let consSuf = 0;
  const date = new Date().toISOString()

  try {
    try {
      mysqlDB = await connection.getDB();
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader10");
    }
    // Check for pending leave request
    try {
      const result = await connection.query(mysqlDB, query.alreadyInPendingLeaveQ, [postParam.empId.replace("EMP00000", ""), postParam.empId.replace("EMP00000", "")]);
      queryResultObj.alreadyInPendingLeave = result[0];
      console.log('Pending leave query result:', queryResultObj.alreadyInPendingLeave);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }
    if (queryResultObj.alreadyInPendingLeave && queryResultObj.alreadyInPendingLeave.count > 0) {
      resultObj.status = 'error';
      resultObj.message = 'Your previous leave request is pending';
      console.log('Returning due to pending leave:', resultObj);
      return resultObj; // Return immediately to exit the function
    }
    // Check for already taken leave
    try {
      const result = await connection.query(mysqlDB, query.alreadyTakeLeaveQ, [postParam.fromDate, postParam.empId.replace("EMP00000", ""), postParam.fromDate, postParam.empId.replace("EMP00000", "")]);
      queryResultObj.alreadyTakeLeave = result[0];
      console.log('Already taken leave query result:', queryResultObj.alreadyTakeLeave);
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }
    if (queryResultObj.alreadyTakeLeave && queryResultObj.alreadyTakeLeave.count > 0) {
      resultObj.status = 'error';
      resultObj.message = `You are already on leave on ${postParam.fromDate}`;
      console.log('Returning due to already taken leave:', resultObj);
      return resultObj; // Return immediately to exit the function
    }

    ///

    // Check for pending leave request
    // try {
    //   queryResultObj.alreadyInPendingLeave = await connection.query(mysqlDB, query.alreadyInPendingLeaveQ, [postParam.empId.replace("EMP00000", "")]);
    // } catch (error) {
    //   console.error(error);
    //   throw new Error("Internal Server Error sAuthenticate-Loader20");
    // }
    // if (queryResultObj.alreadyInPendingLeave.count > 0) {
    //   resultObj.status = 'error';
    //   resultObj.message = 'Your previous leave request is pending';
    //   return resultObj; // Return immediately to exit the function
    // }

    // // Check for already taken leave
    // try {
    //   queryResultObj.alreadyTakeLeave = await connection.query(mysqlDB, query.alreadyTakeLeaveQ, [postParam.fromDate, postParam.empId.replace("EMP00000", "")]);
    // } catch (error) {
    //   console.error(error);
    //   throw new Error("Internal Server Error sAuthenticate-Loader20");
    // }
    // if (queryResultObj.alreadyTakeLeave.count > 0) {
    //   resultObj.status = 'error';
    //   resultObj.message = `You are already on leave on ${postParam.fromDate}`;
    //   return resultObj; // Return immediately to exit the function
    // }





    if (postParam.leaveType == 'CL') {

      try {
        queryResultObj.holidaysinBetweenLeave = await connection.query(mysqlDB, query.holidaysinBetweenLeave, [postParam.fromDate, postParam.toDate]);
        queryResultObj.holidaysinBetweenLeaveList = await connection.query(mysqlDB, query.holidaysinBetweenLeaveList, [postParam.fromDate, postParam.toDate]);

      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
      try {
        const startDate = moment(postParam.fromDate, 'DD/MM/YYYY').toDate();
        const endDate = moment(postParam.toDate, 'DD/MM/YYYY').toDate();
        const diffTime = Math.abs(endDate - startDate);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 - (queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays : 0);
        presuf = 7 - diffDays - queryResultObj.holidaysinBetweenLeave[0].holidays

        queryResultObj.checkPrefixHolidays = await connection.query(mysqlDB, query.checkPrefixHolidays, [moment(postParam.fromDate, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'), postParam.fromDate]);
        queryResultObj.checkSuffixHolidays = await connection.query(mysqlDB, query.checkSuffixHolidays, [postParam.toDate, moment(postParam.toDate, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD')]);
        //queryResultObj.holidays = await connection.query(mysqlDB, query.holidays)
        for (let i = 0; i < queryResultObj.checkPrefixHolidays.length; i++) {
          pre.push(new Date(queryResultObj.checkPrefixHolidays[i].holidays))
        }
        pre.push(new Date(postParam.fromDate))
        suf.push(new Date(postParam.toDate))
        for (let i = 0; i < queryResultObj.checkSuffixHolidays.length; i++) {
          suf.push(new Date(queryResultObj.checkSuffixHolidays[i].holidays))
        }
        for (let i = pre.length; i > 1; i--) {
          let diffTimePre = Math.abs(pre[i - 1] - pre[i - 2]);
          let diffDaysPre = Math.ceil(diffTimePre / (1000 * 60 * 60 * 24)) - 1
          if (diffDaysPre === 0) {
            consPre = consPre + 1
          } else if (diffDaysPre === 1) {
            i = 1
          }
        }
        for (let i = 0; i < suf.length - 1; i++) {
          let diffTimeSuf = Math.abs(suf[i + 1] - suf[i]);
          let diffDaysSuf = Math.ceil(diffTimeSuf / (1000 * 60 * 60 * 24)) - 1
          if (diffDaysSuf === 0) {
            consSuf = consSuf + 1
          } else {
            i = suf.length - 1
          }
        }
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }

      //if(postParam.continue == 1){
      if (postParam.file !== 'undefined') {
        const file = base64.Base64.atob(postParam.file)
        fs.writeFile(`./CDN/${postParam.empId}-${date}-supporting.pdf`, file, 'binary', error => {
          if (error) throw error;
        });
      }
      // try {
      //   //console.log(query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey])
      //   queryResultObj.verifyOTP = await connection.query(mysqlDB, query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey] )
      // } catch(error) {
      //   console.error(error)
      //   resultObj.message = "Internal Server Error 123"
      //   resultObj.status = "error"
      // }
      // if(queryResultObj.verifyOTP !== null && queryResultObj.verifyOTP !== undefined){
      // if (queryResultObj.verifyOTP.affectedRows) {
      if (true) {
        if (diffDays === 0 || diffDays + queryResultObj.holidaysinBetweenLeave[0].holidays + consPre + consSuf > 7 || diffDays > 3) {
          resultObj.status = "error";
          resultObj.message = "Conditions Not matched"
        } else {
          const fromDateAdjusted = moment(postParam.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
          const toDateAdjusted = moment(postParam.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
          // for(let i = 0; i < queryResultObj.holidaysinBetweenLeaveList.length; i++) {
          //     inf.push(moment(queryResultObj.holidaysinBetweenLeaveList[i].holiday, 'YYYY-MM-DD').format('YYYY-MM-DD'))
          // }
          // for(i = moment(postParam.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD'); i <= moment(postParam.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD'); i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')){
          //     if(!inf.includes(i))(
          //         applied.push(i)
          //     )
          // }

          for (let i = fromDateAdjusted; i <= toDateAdjusted; i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')) {
            if (!inf.includes(i)) {
              applied.push(i);
            }
          }
          for (let i = 0; i < applied.length; i++) {
            queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), applied[i], 0, new Date(), applied.length, postParam.reason, "CL", postParam.header, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
          }
          if (queryResultObj.applyForLeave.insertId !== null && queryResultObj.applyForLeave.insertId !== undefined) {
            resultObj.message = `Applied Successfully For Dates ${applied}`
            resultObj.message = `Leave Applied Successfully`
            resultObj.status = "success"
          } else {
            resultObj.message = `Application Failed`
            resultObj.status = "error"
          }
        }
      }
      // else{
      //   resultObj.message = "OTP Verification Failed"
      //   resultObj.status = "error"
      // }
      // }
      //  } else {
      if (diffDays === 0) {
        resultObj.leaveDays = 0
        resultObj.LWPDays = 0
        resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
        resultObj.prefix = consPre
        resultObj.suffix = consSuf
        resultObj.message = `Your leave falls on a holiday, No need to apply`
        resultObj.status = "error"
      } else if (diffDays + queryResultObj.holidaysinBetweenLeave[0].holidays + consPre + consSuf > 7) {
        resultObj.leaveDays = diffDays
        resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
        resultObj.prefix = consPre
        resultObj.suffix = consSuf
        resultObj.message = `Leave at a stretch extends more than 7 days`
        resultObj.status = "error"
      } else if (diffDays > 3) {
        resultObj.leaveDays = diffDays
        resultObj.LWPDays = diffDays - 3
        resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
        resultObj.prefix = consPre
        resultObj.suffix = consSuf
        resultObj.message = `You cannot apply more than 3 days casual leave at once. ${diffDays - 3 > 1 ? diffDays - 3 + ' days' : '1 day'} will be counted as LWP.`
        resultObj.status = "error"
      } else {
        // try {
        //   queryResultObj.otp = await connection.query(mysqlDB, query.otp, [postParam.empId.replace("EMP00000", ""),  postParam.responsible])
        // } catch (error) {
        //   console.error(error);
        //   throw new Error("Internal Server Error sAuthenticate-Loader20");
        // }

        // resultObj.otpKey = queryResultObj.otp.insertId
        resultObj.leaveDays = diffDays
        resultObj.LWPDays = 0
        resultObj.prefix = consPre
        resultObj.suffix = consSuf
        resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
        //resultObj.message = `There ${queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays === 1 ? 'is 1 holiday' : 'are ' + queryResultObj.holidaysinBetweenLeave[0].holidays + ' holidays' : 'are no holidays'} during your leave. Continue?`
        resultObj.message = `Leave Applied Successfully`
        resultObj.status = "success"
      }
      // }
    } else if (postParam.leaveType == 'ML') {
      try {
        queryResultObj.holidaysinBetweenLeave = await connection.query(mysqlDB, query.holidaysinBetweenLeave, [postParam.fromDate, postParam.toDate]);
        queryResultObj.holidaysinBetweenLeaveList = await connection.query(mysqlDB, query.holidaysinBetweenLeaveList, [postParam.fromDate, postParam.toDate]);
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
      try {
        // const startDate = new Date(postParam.fromDate);
        // const endDate = new Date(postParam.toDate);
        const startDate = moment(postParam.fromDate, 'DD/MM/YYYY').toDate();
        const endDate = moment(postParam.toDate, 'DD/MM/YYYY').toDate();
        const diffTime = Math.abs(endDate - startDate);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 - (queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays : 0);
      } catch (error) {

      }


      // if(postParam.continue == 1){
      if (postParam.file !== 'undefined') {
        const file = base64.Base64.atob(postParam.file)
        fs.writeFile(`./CDN/${postParam.empId}-${date}-supporting.pdf`, file, 'binary', error => {
          if (error) throw error;
        });
      }
      // try {
      //   //console.log(query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey])
      //   queryResultObj.verifyOTP = await connection.query(mysqlDB, query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey] )

      // } catch(error) {
      //   console.error(error)
      //   resultObj.message = "Internal Server Error 123"
      //   resultObj.status = "error"
      // }
      // if(queryResultObj.verifyOTP !== null && queryResultObj.verifyOTP !== undefined){
      //if (queryResultObj.verifyOTP.affectedRows) {

      try {
        const fromDateAdjusted = moment(postParam.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const toDateAdjusted = moment(postParam.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD');



        // for(let i = 0; i < queryResultObj.holidaysinBetweenLeaveList.length; i++) {
        //     inf.push(moment(queryResultObj.holidaysinBetweenLeaveList[i].holiday, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        // }
        // for(i = moment(postParam.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD'); i <= moment(postParam.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD'); i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')){
        //     if(!inf.includes(i))(
        //         applied.push(i)
        //     )
        // }
        for (let i = fromDateAdjusted; i <= toDateAdjusted; i = moment(i, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')) {
          if (!inf.includes(i)) {
            applied.push(i);
          }
        }
        for (let i = 0; i < applied.length; i++) {
          queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), applied[i], 0, new Date(), applied.length, postParam.reason, "ML", postParam.headers, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
        }
        if (queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
          resultObj.message = `Applied Successfully For Dates ${applied}`
          resultObj.message = `Leave Applied Successfully`
          resultObj.status = "success"
        }
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }

      // else{
      //   resultObj.message = "OTP Verification Failed"
      //   resultObj.status = "error"
      // }
      //}
      // } else {
      //   try {
      //     queryResultObj.otp = await connection.query(mysqlDB, query.otp, [postParam.empId.replace("EMP00000", ""),  postParam.responsible])
      //   } catch (error) {
      //     console.error(error);
      //     throw new Error("Internal Server Error sAuthenticate-Loader20");
      //   }

      //  resultObj.otpKey = queryResultObj.otp.insertId
      resultObj.leaveDays = diffDays
      resultObj.LWPDays = 0
      resultObj.infix = queryResultObj.holidaysinBetweenLeave[0].holidays
      //resultObj.message = `There ${queryResultObj.holidaysinBetweenLeave[0].holidays ? queryResultObj.holidaysinBetweenLeave[0].holidays === 1 ? 'is 1 holiday' : 'are ' + queryResultObj.holidaysinBetweenLeave[0].holidays + ' holidays' : 'are no holidays'} during your leave`
      resultObj.status = "success"
      // }
    } else if (postParam.leaveType == 'PL') {
      try {
        // console.log(postParam)
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }
      // if(postParam.continue == 1){
      if (postParam.file !== 'undefined') {
        const file = base64.Base64.atob(postParam.file)
        fs.writeFile(`./CDN/${postParam.empId}-${date}-supporting.pdf`, file, 'binary', error => {
          if (error) throw error;
        });
      }
      // try {
      //  // console.log(query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey])
      //   queryResultObj.verifyOTP = await connection.query(mysqlDB, query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey] )
      //  // console.log("here")
      // } catch(error) {
      //   console.error(error)
      //   resultObj.message = "Internal Server Error 123"
      //   resultObj.status = "error"
      // }
      //if(queryResultObj.verifyOTP !== null && queryResultObj.verifyOTP !== undefined){
      //if (queryResultObj.verifyOTP.affectedRows) {

      try {
        const fromDateAdjusted = moment(postParam.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const toDateAdjusted = moment(postParam.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

        console.log("from--------", fromDateAdjusted);
        console.log("to-------------", toDateAdjusted)

        queryResultObj.gender = await connection.query(mysqlDB, query.gender, [postParam.empId.replace("EMP00000", "")])
        //console.log(queryResultObj.gender)
        let calculatedToDate;
        if (queryResultObj.gender[0].gender == 1) {
          // For males, calculate the end date as 14 days after the start date
          calculatedToDate = moment(fromDateAdjusted).add('days').format('YYYY-MM-DD');
        } else if (queryResultObj.gender[0].gender == 2) {
          // For females, calculate the end date as 179 days after the start date
          calculatedToDate = moment(fromDateAdjusted).add('days').format('YYYY-MM-DD');
        }

        if (queryResultObj.gender[0].gender == 1) {
          queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForParentalLeaveMale, [postParam.empId.replace("EMP00000", ""), fromDateAdjusted, calculatedToDate, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
          if (queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
            resultObj.message = `Leave Applied Successfully`
            resultObj.status = "success"
          }
        } else if (queryResultObj.gender[0].gender == 2) {
          queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForParentalLeaveFemale, [postParam.empId.replace("EMP00000", ""), fromDateAdjusted, calculatedToDate, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
          if (queryResultObj.applyForLeave !== null && queryResultObj.applyForLeave !== undefined) {
            resultObj.message = `Leave Applied Successfully`
            resultObj.status = "success"
          }
        } else {
          resultObj.message = `You are not eligible for parental leave`
          resultObj.status = "error"
        }
        // console.log(resultObj)
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }

      // else{
      //   resultObj.message = "OTP Verification Failed"
      //   resultObj.status = "error"
      // }
      // }
      // } else {
      //   try {
      //     queryResultObj.otp = await connection.query(mysqlDB, query.otp, [postParam.empId.replace("EMP00000", ""),  postParam.responsible])
      //   } catch (error) {
      //     console.error(error);
      //     throw new Error("Internal Server Error sAuthenticate-Loader20");
      //   }

      //  resultObj.otpKey = queryResultObj.otp.insertId
      resultObj.leaveDays = diffDays
      resultObj.message = `Leave Applied Successfully`
      resultObj.status = "success"
      // console.log(resultObj)
      //}
    } else if (postParam.leaveType == 'RH') {
      try {
        // console.log(postParam)
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }
      // if(postParam.continue == 1){
      if (postParam.file !== 'undefined') {
        const file = base64.Base64.atob(postParam.file)
        fs.writeFile(`./CDN/${postParam.empId}-${date}-supporting.pdf`, file, 'binary', error => {
          if (error) throw error;
        });
      }
      // try {
      //   //console.log(query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey])
      //   queryResultObj.verifyOTP = await connection.query(mysqlDB, query.verifyOTP, [postParam.empId.replace("EMP00000", ""), postParam.otp, postParam.otpKey] )
      //  // console.log("here")
      // } catch(error) {
      //   console.error(error)
      //   resultObj.message = "Internal Server Error 123"
      //   resultObj.status = "error"
      // }
      //if(queryResultObj.verifyOTP !== null && queryResultObj.verifyOTP !== undefined){
      //if (queryResultObj.verifyOTP.affectedRows) {
      // if(ture) {  
      // let leaveDate = new Date(postParam.fromDate);
      let leaveDate = moment(postParam.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      try {
        queryResultObj.previousRHCurrentMonth = await connection.query(mysqlDB, query.previousRHCurrentMonth, [leaveDate])
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }
      try {
        queryResultObj.previousRHCurrentYear = await connection.query(mysqlDB, query.previousRHCurrentYear, [leaveDate])
      } catch (error) {
        console.error(error)
        throw new Error('Error in Applying Leave')
      }
      if (queryResultObj.previousRHCurrentYear[0].count < 2) {
        if (queryResultObj.previousRHCurrentMonth[0].count === 0) {
          queryResultObj.applyForLeave = await connection.query(mysqlDB, query.applyForLeave, [postParam.empId.replace("EMP00000", ""), leaveDate, 0, new Date(), 1, postParam.reason, "RH", postParam.header, postParam.responsible, postParam.file !== 'undefined' ? `${postParam.empId}-${date}-supporting.pdf` : null])
          if (queryResultObj.applyForLeave.insertId !== null && queryResultObj.applyForLeave.insertId !== undefined) {
            resultObj.message = `Applied Successfully For Dates ${applied}`
            resultObj.message = `Leave Applied Successfully`
            resultObj.status = "success"
          } else {
            resultObj.message = `Application Failed`
            resultObj.status = "error"
          }
        } else {
          resultObj.message = "You have already applied a restricted holiday this month"
          resultObj.status = "error"
        }
      } else {
        resultObj.message = "You have already applied 2 restricted holidays this year"
        resultObj.status = "error"
      }
      //console.log(resultObj)
      //} 
      // else{
      //   resultObj.message = "OTP Verification Failed"
      //   resultObj.status = "error"
      // }
      // }

      // } else {
      //leaveDate = new Date(postParam.fromDate);
      leaveDate = moment(postParam.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      try {
        queryResultObj.restrictedHolidays = await connection.query(mysqlDB, query.restrictedHolidays, [leaveDate])

      } catch (error) {
        console.error(error)
        throw new Error(`Error in Applying Leave`)
      }

      if (queryResultObj.restrictedHolidays !== null && queryResultObj.restrictedHolidays !== undefined && queryResultObj.restrictedHolidays.length > 0) {
        resultObj.message = `You have Applied for Restricted Holiday for ${queryResultObj.restrictedHolidays[0].holiday}. Please Confirm`
        resultObj.status = "success"
        // try {
        //   queryResultObj.otp = await connection.query(mysqlDB, query.otp, [postParam.empId.replace("EMP00000", ""),  postParam.responsible])
        // } catch (error) {
        //   console.error(error);
        //   throw new Error("Internal Server Error sAuthenticate-Loader20");
        // }

        // resultObj.otpKey = queryResultObj.otp.insertId
      } else {
        resultObj.message = `Error in Applying Leave. No Restricted Holiday Available`
        resultObj.status = "error"
      }
      //}
    }


    if (queryResultObj !== null && queryResultObj !== undefined) {
      return resultObj;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sAuthenticate-Loader40");
  } finally {
    mysqlDB.release()
  }
});


exports.Applied = co.wrap(async function (postParam) {
  let queryResultObj = {};
  let resultObj = {};
  let mysqlDB;
  const baseUrl = 'https://hrms.skillmissionassam.org/nw2/static/';
  try {
    console.log(postParam)
    try {
      mysqlDB = await connection.getDB();
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader10");
    }
    //let month = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January']
    //queryResultObj.applied = {}
    try {
      
      for (let i = 12; i >= 1; i--) {
      
      
        if(postParam.startDate && postParam.endDate){
          let filterQuery=query.appliedbyrange

          if (postParam.status=="pending") {
              filterQuery += " AND bPending = 1";
          } else if (postParam.status=="approve") {
              filterQuery += " AND bApproval = 1";
          } else if (postParam.status=="reject") {
              filterQuery += " AND bApproval = 0";
          }
          filterQuery += ` GROUP BY appliedDate, leaveType, reason, status, rejectionReason, leaveHeader 
          ORDER BY appliedDate, leaveType`;


          queryResultObj.applied = await connection.query(mysqlDB,filterQuery, [postParam.empId.replace("EMP00000", ""),postParam.startDate,postParam.endDate]);
        }else if(postParam.month){

          let filterQuery=query.appliedbyMonth;
          if (postParam.status=="pending") {
            filterQuery += " AND bPending = 1";
          } else if (postParam.status=="approve") {
              filterQuery += " AND bApproval = 1";
          } else if (postParam.status=="reject") {
              filterQuery += " AND bApproval = 0";
          }
          filterQuery += ` GROUP BY appliedDate, leaveType, reason, status, rejectionReason, leaveHeader
          ORDER BY appliedDate, leaveType;`;

          queryResultObj.applied = await connection.query(mysqlDB,filterQuery , [postParam.empId.replace("EMP00000", ""),postParam.month]);
        }else if(postParam.week){

          let filterQuery=query.appliedbyweek;
          if (postParam.status=="pending") {
            filterQuery += " AND bPending = 1";
          } else if (postParam.status=="approve") {
              filterQuery += " AND bApproval = 1";
          } else if (postParam.status=="reject") {
              filterQuery += " AND bApproval = 0";
          }
          filterQuery += ` GROUP BY appliedDate, leaveType, reason, status, rejectionReason, leaveHeader
          ORDER BY appliedDate, leaveType;`;

          try {
            queryResultObj.applied = await connection.query(
              mysqlDB,
              filterQuery,
              [postParam.empId.replace("EMP00000", "")]
            );
          } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error sAttendance-Loader40");
          }
        }else if(postParam.curDate){
          let filterQuery=query.appliedbycurDate;
          if (postParam.status=="pending") {
            filterQuery += " AND bPending = 1";
          } else if (postParam.status=="approve") {
              filterQuery += " AND bApproval = 1";
          } else if (postParam.status=="reject") {
              filterQuery += " AND bApproval = 0";
          }
          filterQuery += ` GROUP BY appliedDate, leaveType, reason, status, rejectionReason, leaveHeader
          ORDER BY appliedDate, leaveType;`;
          try {
            queryResultObj.applied = await connection.query(
              mysqlDB,
              filterQuery,
              [postParam.empId.replace("EMP00000", "")]
            );
          } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error sAttendance-Loader40");
          }
        }
        else{
          let filterQuery=query.applied;
          if (postParam.status=="pending") {
            filterQuery += " AND bPending = 1";
          } else if (postParam.status=="approve") {
              filterQuery += " AND bApproval = 1";
          } else if (postParam.status=="reject") {
              filterQuery += " AND bApproval = 0";
          }
          filterQuery += ` GROUP BY appliedDate, leaveType, reason, status, rejectionReason, leaveHeader 
          ORDER BY appliedDate, leaveType;`;
          queryResultObj.applied = await connection.query(mysqlDB, filterQuery, [postParam.empId.replace("EMP00000", "")]);
      
        }
        
        // if(data.length > 0){
        //   queryResultObj.applied[month[12-i]] = data
        // } 
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error sAuthenticate-Loader20");
    }
    if (queryResultObj.applied !== null && queryResultObj.applied !== undefined) {
      try {
        queryResultObj.parentalLeave = await connection.query(mysqlDB, query.parentalLeave, [postParam.empId.replace("EMP00000", "")])
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sAuthenticate-Loader20");
      }
      console.log("here-----------------------", queryResultObj.parentalLeave)

      // Add PDF URL to the response data
      resultObj.data = queryResultObj.applied.map(item => {
        if (item.document && item.document.endsWith('.pdf')) {
          item.pdfUrl = baseUrl + item.document;
        }
        return item;
      });
      // Add parental leave data with PDF URLs
      queryResultObj.parentalLeave.forEach(leave => {
        if (leave.document && leave.document.endsWith('.pdf')) {
          leave.pdfUrl = baseUrl + leave.document;
        }
        resultObj.data.push({ ...leave });
      });

      // resultObj.data = queryResultObj.applied
      // resultObj.data.push(...queryResultObj.parentalLeave.map(leave => ({ ...leave })));
      resultObj.status = "success";
    }


    // try {
    //   queryResultObj.parentalLeave = await connection.query(mysqlDB, query.parentalLeave, [postParam.empId.replace("EMP00000", "")] )
    // } catch (error) {
    //   console.error(error);
    //   throw new Error("Internal Server Error sAuthenticate-Loader20");
    // }

    // if (queryResultObj.parentalLeave !== null && queryResultObj.parentalLeave !== undefined && queryResultObj.parentalLeave.length > 0) {
    //   resultObj.parentalLeave = queryResultObj.parentalLeave
    // }

  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sAuthenticate-Loader40");
  } finally {
    mysqlDB.release()
  }
  console.log(resultObj)
  return resultObj;
});