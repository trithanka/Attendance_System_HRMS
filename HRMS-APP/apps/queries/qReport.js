const query = {
    attendanceReport: `SELECT vsDate AS date, vsTime AS time FROM nw_staff_attendance attendance LEFT JOIN nw_staff_attendance_UUID uuid ON uuid.fklEmpCode = attendance.fklEmpCode WHERE vsUUID = ?`

}

module.exports = exports = query