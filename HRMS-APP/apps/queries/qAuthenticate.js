const query = {
    checkEmp: `SELECT pklEmpCode AS empCode FROM nw_staff_attendance_dtl WHERE vsEmpName = ?`,
    
    saveUUID: `INSERT INTO nw_staff_attendance_UUID (vsUUID, bEnabled, fklEmpCode, vsDeviceName) VALUES (?, ?, ?, ?)` ,
    
    checkActiveUUID: `SELECT COUNT(*) AS count FROM nw_staff_attendance_dtl LEFT JOIN nw_staff_attendance_UUID ON fklEmpCode = pklEmpCode WHERE vsEmpName = ? AND bEnabled = 1`,
    
    checkActiveUUIDwithUUID: `SELECT COUNT(*) AS count FROM nw_staff_attendance_dtl LEFT JOIN nw_staff_attendance_UUID ON fklEmpCode = pklEmpCode WHERE vsEmpName = ? AND vsUUID = ? AND bEnabled = 1`,
    
    checkUUIDEntry: `SELECT COUNT(*) AS count FROM nw_staff_attendance_dtl LEFT JOIN nw_staff_attendance_UUID ON fklEmpCode = pklEmpCode WHERE vsEmpName = ? AND vsUUID = ?`,

    checkReleaseEmp : `SELECT pklEmpCode AS empCode FROM nw_staff_attendance_dtl WHERE vsEmpName = ? AND bReleased = 1`,

    checkUUIDForOtherEmp: `SELECT fklEmpCode AS empCode FROM nw_staff_attendance_UUID WHERE vsUUID = ? AND fklEmpCode != (SELECT pklEmpCode FROM nw_staff_attendance_dtl WHERE vsEmpName = ?)`,

    disableUUIDForOtherEmp: `UPDATE nw_staff_attendance_UUID SET bEnabled = 0 WHERE vsUUID = ?`,
}

module.exports = exports = query