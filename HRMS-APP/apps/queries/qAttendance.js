const query = {
    checkValid: `SELECT COUNT(*) AS count FROM nw_staff_attendance_dtl LEFT JOIN nw_staff_attendance_UUID ON fklEmpCode = pklEmpCode WHERE vsUUID = ? AND bEnabled = 1`,
    getCandidateId: `SELECT fklEmpCode AS empCode FROM nw_staff_attendance_dtl LEFT JOIN nw_staff_attendance_UUID ON fklEmpCode = pklEmpCode WHERE vsUUID = ? AND bEnabled = 1`,
    
    checkCurentDateLeaveQ : ` SELECT COUNT(*) count FROM nw_staff_attendance_leave_applications
    WHERE dtLeaveDate = curdate() AND bApproval = 1 AND fklEmpCode = ?`,
    
    markAttendance: `INSERT INTO nw_staff_attendance (fklEmpCode, vsDate, vsTime, bInOut, bOutdoor, vsReason) VALUES(?, DATE_FORMAT(CURDATE(), '%Y-%m-%d'), CURTIME(), ?, ?, ?)`,
    getAttendance: `SELECT COUNT (*) AS count FROM nw_staff_attendance attn LEFT JOIN nw_staff_attendance_UUID uuid ON uuid.fklEmpCode = attn.fklEmpCode WHERE bEnabled = 1 AND vsUUID = ? AND vsDate = DATE_FORMAT(CURDATE(), '%Y-%m-%d')`,

    checkCurrentDateLeave : `SELECT COUNT(*) AS count FROM nw_staff_attendance_leave_applications
                             WHERE bApproval = 1 AND dtLeaveDate = CURDATE() AND fklEmpCode = ?`,
    
    getAttendanceQuery:`SELECT 
    personal.pklEmployeeRegId AS registrationId, 
    staff.vsEmpName AS empId, 
    personal.vsFirstName AS firstName, 
    IFNULL(personal.vsMiddleName, '') AS middleName, 
    personal.vsLastName AS lastName,
    personal.vsPhoneNumber AS phone, 
    personal.vsDOB AS DOB, 
    dept.pklInternalDepartmentId AS departmentId, 
    dept.vsInternalDepartmentName AS departmentName,
    DATE_FORMAT(dailyAttendance.attDate, '%Y-%m-%d') AS attendanceDate,
    DATE_FORMAT(MIN(dailyAttendance.vsTime), '%r') AS punchIn,
    CASE 
        WHEN COUNT(dailyAttendance.vsTime) > 1 THEN DATE_FORMAT(MAX(dailyAttendance.vsTime), '%r')
        ELSE NULL
    END AS punchOut,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MIN(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchInOutdoor,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MAX(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchOutOutdoor,
    geo.vsGeolocationName AS location,
    desig.vsDesignationName AS designation
FROM 
    nw_employee_personal_dtls personal
LEFT JOIN 
    nw_employee_employment_dtls emp ON personal.pklEmployeeRegId = emp.fklEmployeeRegId
LEFT JOIN 
    nw_mams_internal_department dept ON emp.vsDepartment = dept.pklInternalDepartmentId
LEFT JOIN 
    nw_staff_attendance_dtl staff ON staff.fklEmployeeRegId = personal.pklEmployeeRegId
INNER JOIN 
    (
        SELECT 
            fklEmpCode, 
            DATE(vsTime) AS attDate, 
            vsTime
        FROM 
            nw_staff_attendance
        WHERE 
            DATE_FORMAT(vsTime, '%Y-%m-%d') BETWEEN ? AND ?
    ) dailyAttendance ON dailyAttendance.fklEmpCode = staff.pklEmpCode
LEFT JOIN 
    nw_mams_geolocation geo ON staff.fklLocationId = geo.pklLocationId
LEFT JOIN 
    nw_mams_designation desig ON emp.vsDesignation = desig.pklDesignationId
WHERE 
    staff.vsEmpName = ?
GROUP BY 
    dailyAttendance.attDate, personal.pklEmployeeRegId, staff.vsEmpName, personal.vsFirstName, personal.vsMiddleName, personal.vsLastName,
    personal.vsPhoneNumber, personal.vsDOB, dept.pklInternalDepartmentId, dept.vsInternalDepartmentName, geo.vsGeolocationName, desig.vsDesignationName
ORDER BY 
    dailyAttendance.attDate DESC;`,

    getAttendanceQuerybyMonth:`SELECT 
    personal.pklEmployeeRegId AS registrationId, 
    staff.vsEmpName AS empId, 
    personal.vsFirstName AS firstName, 
    IFNULL(personal.vsMiddleName, '') AS middleName, 
    personal.vsLastName AS lastName,
    personal.vsPhoneNumber AS phone, 
    personal.vsDOB AS DOB, 
    dept.pklInternalDepartmentId AS departmentId, 
    dept.vsInternalDepartmentName AS departmentName,
    DATE_FORMAT(dailyAttendance.attDate, '%Y-%m-%d') AS attendanceDate,
    DATE_FORMAT(MIN(dailyAttendance.vsTime), '%r') AS punchIn,
    CASE 
        WHEN COUNT(dailyAttendance.vsTime) > 1 THEN DATE_FORMAT(MAX(dailyAttendance.vsTime), '%r')
        ELSE NULL
    END AS punchOut,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MIN(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchInOutdoor,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MAX(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchOutOutdoor,
    geo.vsGeolocationName AS location,
    desig.vsDesignationName AS designation
FROM 
    nw_employee_personal_dtls personal
LEFT JOIN 
    nw_employee_employment_dtls emp ON personal.pklEmployeeRegId = emp.fklEmployeeRegId
LEFT JOIN 
    nw_mams_internal_department dept ON emp.vsDepartment = dept.pklInternalDepartmentId
LEFT JOIN 
    nw_staff_attendance_dtl staff ON staff.fklEmployeeRegId = personal.pklEmployeeRegId
INNER JOIN 
    (
        SELECT 
            fklEmpCode, 
            DATE(vsTime) AS attDate, 
            vsTime
        FROM 
            nw_staff_attendance
        WHERE 
            DATE_FORMAT(vsTime, '%Y-%m') = ?
    ) dailyAttendance ON dailyAttendance.fklEmpCode = staff.pklEmpCode
LEFT JOIN 
    nw_mams_geolocation geo ON staff.fklLocationId = geo.pklLocationId
LEFT JOIN 
    nw_mams_designation desig ON emp.vsDesignation = desig.pklDesignationId
WHERE 
    staff.vsEmpName = ?
GROUP BY 
    dailyAttendance.attDate, personal.pklEmployeeRegId, staff.vsEmpName, personal.vsFirstName, personal.vsMiddleName, personal.vsLastName,
    personal.vsPhoneNumber, personal.vsDOB, dept.pklInternalDepartmentId, dept.vsInternalDepartmentName, geo.vsGeolocationName, desig.vsDesignationName
ORDER BY 
    dailyAttendance.attDate DESC;`,
    getAttendanceQueryLastWeek:`SELECT 
    personal.pklEmployeeRegId AS registrationId, 
    staff.vsEmpName AS empId, 
    personal.vsFirstName AS firstName, 
    IFNULL(personal.vsMiddleName, '') AS middleName, 
    personal.vsLastName AS lastName, 
    personal.vsPhoneNumber AS phone, 
    personal.vsDOB AS DOB, 
    dept.pklInternalDepartmentId AS departmentId, 
    dept.vsInternalDepartmentName AS departmentName,
    DATE_FORMAT(dailyAttendance.attDate, '%Y-%m-%d') AS attendanceDate,
    DATE_FORMAT(MIN(dailyAttendance.vsTime), '%r') AS punchIn,
    CASE 
        WHEN COUNT(dailyAttendance.vsTime) > 1 THEN DATE_FORMAT(MAX(dailyAttendance.vsTime), '%r')
        ELSE NULL
    END AS punchOut,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MIN(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchInOutdoor,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MAX(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchOutOutdoor,
    geo.vsGeolocationName AS location,
    desig.vsDesignationName AS designation
FROM 
    nw_employee_personal_dtls personal
LEFT JOIN 
    nw_employee_employment_dtls emp ON personal.pklEmployeeRegId = emp.fklEmployeeRegId
LEFT JOIN 
    nw_mams_internal_department dept ON emp.vsDepartment = dept.pklInternalDepartmentId
LEFT JOIN 
    nw_staff_attendance_dtl staff ON staff.fklEmployeeRegId = personal.pklEmployeeRegId
INNER JOIN 
    (
        SELECT 
            fklEmpCode, 
            DATE(vsTime) AS attDate, 
            vsTime
        FROM 
            nw_staff_attendance
        WHERE 
            vsTime >= CURDATE() - INTERVAL 6 DAY 
            AND vsTime < CURDATE() + INTERVAL 1 DAY
    ) dailyAttendance ON dailyAttendance.fklEmpCode = staff.pklEmpCode
LEFT JOIN 
    nw_mams_geolocation geo ON staff.fklLocationId = geo.pklLocationId 
LEFT JOIN 
    nw_mams_designation desig ON emp.vsDesignation = desig.pklDesignationId
WHERE 
    staff.vsEmpName = ?
GROUP BY 
    dailyAttendance.attDate, personal.pklEmployeeRegId, staff.vsEmpName, personal.vsFirstName, personal.vsMiddleName, personal.vsLastName,
    personal.vsPhoneNumber, personal.vsDOB, dept.pklInternalDepartmentId, dept.vsInternalDepartmentName, geo.vsGeolocationName, desig.vsDesignationName
ORDER BY 
    dailyAttendance.attDate DESC;`,
    getAttendanceQueryCurDate:`SELECT 
    personal.pklEmployeeRegId AS registrationId, 
    staff.vsEmpName AS empId, 
    personal.vsFirstName AS firstName, 
    IFNULL(personal.vsMiddleName, '') AS middleName, 
    personal.vsLastName AS lastName, 
    personal.vsPhoneNumber AS phone, 
    personal.vsDOB AS DOB, 
    dept.pklInternalDepartmentId AS departmentId, 
    dept.vsInternalDepartmentName AS departmentName,
    DATE_FORMAT(dailyAttendance.attDate, '%Y-%m-%d') AS attendanceDate,
    DATE_FORMAT(MIN(dailyAttendance.vsTime), '%r') AS punchIn,
    CASE 
        WHEN COUNT(dailyAttendance.vsTime) > 1 THEN DATE_FORMAT(MAX(dailyAttendance.vsTime), '%r')
        ELSE NULL
    END AS punchOut,
    (SELECT bOutdoor
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MIN(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchInOutdoor,
    (SELECT bOutdoor 
     FROM nw_staff_attendance att 
     WHERE att.vsTime = MAX(dailyAttendance.vsTime) AND att.fklEmpCode = dailyAttendance.fklEmpCode) AS punchOutOutdoor,
    geo.vsGeolocationName AS location,
    desig.vsDesignationName AS designation
FROM 
    nw_employee_personal_dtls personal
LEFT JOIN 
    nw_employee_employment_dtls emp ON personal.pklEmployeeRegId = emp.fklEmployeeRegId
LEFT JOIN 
    nw_mams_internal_department dept ON emp.vsDepartment = dept.pklInternalDepartmentId
LEFT JOIN 
    nw_staff_attendance_dtl staff ON staff.fklEmployeeRegId = personal.pklEmployeeRegId
INNER JOIN 
    (
        SELECT 
            fklEmpCode, 
            DATE(vsTime) AS attDate, 
            vsTime
        FROM 
            nw_staff_attendance
        WHERE 
            date(vsTime) =CURDATE()
    ) dailyAttendance ON dailyAttendance.fklEmpCode = staff.pklEmpCode
LEFT JOIN 
    nw_mams_geolocation geo ON staff.fklLocationId = geo.pklLocationId 
LEFT JOIN 
    nw_mams_designation desig ON emp.vsDesignation = desig.pklDesignationId
WHERE 
    staff.vsEmpName = ?
GROUP BY 
    dailyAttendance.attDate, personal.pklEmployeeRegId, staff.vsEmpName, personal.vsFirstName, personal.vsMiddleName, personal.vsLastName,
    personal.vsPhoneNumber, personal.vsDOB, dept.pklInternalDepartmentId, dept.vsInternalDepartmentName, geo.vsGeolocationName, desig.vsDesignationName
ORDER BY 
    dailyAttendance.attDate DESC;`

}

module.exports = exports = query