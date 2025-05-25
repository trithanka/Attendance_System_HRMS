const query = {
    getCoordinates: `SELECT
    geo.vsName AS name, 
    geo.vsGeolocationName AS landmark,    
    geo.vsLat1 AS lat1,
    geo.vsLong1 long1,
	geo.vsLat2 lat2,
    geo.vsLong2 long2,
	geo.vsLat3 lat3,
    geo.vsLong3 long3,
	geo.vsLat4 lat4,
    geo.vsLong4 long4 
    FROM nw_mams_geolocation geo
    INNER JOIN nw_staff_attendance_dtl dtl ON geo.pklLocationId = dtl.fklLocationId WHERE dtl.pklEmpCode= ?`,
    getDatetime: `SELECT CURRENT_TIMESTAMP() AS serverTime`,

    //update query
    getAttendanceTime : `SELECT 
    date, 
    time,
    SUBSTRING_INDEX(time, ',', 1) AS inTime,
    CASE 
        WHEN LOCATE(',', time) = 0 THEN ''
        ELSE SUBSTRING_INDEX(SUBSTRING_INDEX(time, ',', 2), ',', -1)
    END AS outTime,
    SUBSTRING_INDEX(attendanceMarker, ',', 1) AS attendanceMarkerIn,
    CASE 
        WHEN LOCATE(',', attendanceMarker) = 0 THEN ''
        ELSE SUBSTRING_INDEX(SUBSTRING_INDEX(attendanceMarker, ',', 2), ',', -1)
    END AS attendanceMarkerOut
FROM (
    SELECT 
        satt.vsDate AS date,
        GROUP_CONCAT(TIME_FORMAT(satt.vsTime, '%H:%i:%s') ORDER BY satt.vsTime SEPARATOR ',') AS time,
        GROUP_CONCAT(
            CASE
                WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('10:00:00', '%H:%i:%s') THEN 'EARLY IN INDOOR'
                WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('10:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'ON TIME IN INDOOR'
                WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'LATE IN INDOOR'
                WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('17:00:00', '%H:%i:%s') THEN 'EARLY OUT INDOOR'
                WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('17:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'ON TIME OUT INDOOR'
                WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'LATE OUT INDOOR'
                WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('10:00:00', '%H:%i:%s') THEN 'EARLY IN OUTDOOR'
                WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('10:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'ON TIME IN OUTDOOR'
                WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'LATE IN OUTDOOR'
                WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('17:00:00', '%H:%i:%s') THEN 'EARLY OUT OUTDOOR'
                WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('17:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'ON TIME OUT OUTDOOR'
                WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'LATE OUT OUTDOOR'
            END 
            ORDER BY satt.vsTime SEPARATOR ','
        ) AS attendanceMarker
    FROM nw_staff_attendance satt
    INNER JOIN nw_staff_attendance_dtl adtl ON adtl.pklEmpCode = satt.fklEmpCode
    WHERE adtl.pklEmpCode = ? AND satt.vsDate = CURDATE()
    GROUP BY satt.vsDate
) data;`,

//     getAttendanceTime : `SELECT date, 
//     time,
//     TIME_FORMAT(SUBSTRING_INDEX(SUBSTRING_INDEX(time, ',', 1), ',', -1), '%h:%i %p') AS inTime,
//     TIME_FORMAT(SUBSTRING_INDEX(SUBSTRING_INDEX(time, ',', 2), ',', -1), '%h:%i %p') AS outTime,
//     SUBSTRING_INDEX(SUBSTRING_INDEX(attendanceMarker, ',', 1), ',', -1) AS attendanceMarkerIn,
//     SUBSTRING_INDEX(SUBSTRING_INDEX(attendanceMarker, ',', 2), ',', -1) AS attendanceMarkerOut  
// FROM (
//  SELECT 
//      satt.vsDate AS date,
//      GROUP_CONCAT(TIME_FORMAT(satt.vsTime, '%H:%i:%s')) AS time,
//      GROUP_CONCAT(CASE
//          WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('10:00:00', '%H:%i:%s') THEN 'EARLY IN INDOOR'
//          WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('10:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'ON TIME IN INDOOR'
//          WHEN bOutdoor = 1 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'LATE IN INDOOR'  
//          WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('17:00:00', '%H:%i:%s') THEN 'EARLY OUT INDOOR'
//          WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('17:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'ON TIME OUT INDOOR'
//          WHEN bOutdoor = 1 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'LATE OUT INDOOR'
//          WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('10:00:00', '%H:%i:%s') THEN 'EARLY IN OUTDOOR'
//          WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('10:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'ON TIME IN OUTDOOR'
//          WHEN bOutdoor = 0 AND bInOut = 0 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('10:30:00', '%H:%i:%s') THEN 'LATE IN OUTDOOR'  
//          WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') < TIME_FORMAT('17:00:00', '%H:%i:%s') THEN 'EARLY OUT OUTDOOR'
//          WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') >= TIME_FORMAT('17:00:00', '%H:%i:%s') AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') <= TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'ON TIME OUT OUTDOOR'
//          WHEN bOutdoor = 0 AND bInOut = 1 AND TIME_FORMAT(satt.vsTime, '%H:%i:%s') > TIME_FORMAT('17:30:00', '%H:%i:%s') THEN 'LATE OUT OUTDOOR'
//      END) AS attendanceMarker
//  FROM nw_staff_attendance satt
//  INNER JOIN nw_staff_attendance_dtl adtl ON adtl.pklEmpCode = satt.fklEmpCode
//  WHERE adtl.pklEmpCode = ? AND satt.vsDate = CURDATE()
//  GROUP BY satt.vsDate
// ) data;
// `,

    timeConstraint: `SELECT vsLowerBound AS startTime, vsUpperBound AS endTime FROM nw_staff_attendance_time_constraint`,
    personal: `SELECT CONCAT(vsFirstName, ' ', IFNULL(vsMiddleName, ''), ' ', vsLastName) AS name 
    FROM nw_employee_personal_dtls pdtl 
    LEFT JOIN nw_staff_attendance_dtl adtl ON pdtl.pklEmployeeRegId = adtl.fklEmployeeRegId
    WHERE pklEmpCode = ?`,
    inOut: `SELECT COUNT(*) AS count FROM nw_staff_attendance WHERE vsDate = CURDATE() AND bInOut = 0 AND fklEmpCode = ?`,
    outIn: `SELECT COUNT(*) AS count FROM nw_staff_attendance WHERE vsDate = CURDATE() AND bInOut = 1 AND fklEmpCode = ?`,
    loginTime: `SELECT DATE_FORMAT(TIMEDIFF(NOW(), vsTime), '%H:%i') AS time FROM nw_staff_attendance WHERE vsDate = CURDATE() AND bInOut = 0 AND fklEmpCode = ?`,
    responsibility: `SELECT CONCAT(vsFirstName, ' ', IFNULL(vsMiddleName, ''), ' ', vsLastName) AS leaveTaker , GROUP_CONCAT(DATE_FORMAT(dtLeaveDate, ' %d-%b')) AS leaveDates FROM nw_staff_attendance_leave_applications lapply 
    INNER JOIN nw_staff_attendance_dtl adtl ON adtl.pklEmpCode = lapply.fklResponsibleOfficerId
    INNER JOIN nw_staff_attendance_dtl adtl1 ON adtl1.pklEmpCode = lapply.fklEmpCode
    INNER JOIN nw_employee_personal_dtls pdtl ON adtl1.fklEmployeeRegId = pdtl.pklEmployeeRegId 
    WHERE dtLeaveDate > NOW() AND adtl.pklEmpCode = ?
    GROUP BY leaveTaker`,

    responsibilityOTP: `SELECT vsOTP AS otp, CONCAT(vsFirstName, ' ', IFNULL(vsMiddleName, ''), ' ', vsLastName) AS name FROM nw_staff_attendance_otp_confirmation oconf 
            INNER JOIN nw_staff_attendance_dtl adtl ON adtl.pklEmpCode = oconf.fklEmpCode
            INNER JOIN nw_employee_personal_dtls pdtl ON pdtl.pklEmployeeRegId = adtl.fklEmployeeRegId
            WHERE oconf.bVerified = 0 AND oconf.fklResponsibleOfficerId = ? AND NOW() < ADDTIME(oconf.dtCreatedAt, "300")`
}

module.exports = exports = query