const query = {
    leavesCheck: `SELECT 
    iCasualLeave AS casualLeave, 
    iSickLeave AS sickLeave, 
    iParentalLeave AS parentalLeave 
    FROM nw_staff_attendance_leaves_allotted allo 
    LEFT JOIN nw_mams_year year ON year.pklYearId = allo.fklYearId 
    WHERE allo.fklEmpCode = ? AND year.vsYear = ?`,
    leavesHeader: `SELECT pklLeaveHeaderId AS id, vsLeaveHeader AS header FROM nw_mams_leave_header;`,
    restrictedHolidays: `SELECT vsLeaveName AS holiday FROM nw_mams_restricted_holidays WHERE dtLeaveDate = ?`,
    leavesResponsibility: `SELECT adtl.pklEmpCode AS value, CONCAT(vsFirstName, ' ', IFNULL(vsMiddleName, ''), ' ', vsLastName) AS label FROM nw_employee_personal_dtls pdtl INNER JOIN nw_staff_attendance_dtl adtl ON adtl.fklEmployeeRegId = pdtl.pklEmployeeRegId;`,
    previousRHCurrentMonth: `SELECT COUNT(*) AS count FROM nw_staff_attendance_leave_applications WHERE MONTH(?) = MONTH(CURDATE()) AND bApproval = 1 AND vsType = 'RH'`,
    previousRHCurrentYear: `SELECT COUNT(*) AS count FROM nw_staff_attendance_leave_applications WHERE YEAR(?) = YEAR(CURDATE()) AND bApproval = 1 AND vsType = 'RH'`,
    holidays: `SELECT vsLeaveName AS leaveName, DATE_FORMAT(dtLeaveDate, '%Y-%m-%d') AS leaveDate, DATE_FORMAT(dtLeaveDate, '%W') AS leaveDay FROM nw_mams_leave WHERE dtLeaveDate > NOW()`,
    //
    alreadyInPendingLeaveQ : `SELECT SUM(count) AS count
    FROM (
        SELECT COUNT(*) AS count 
        FROM nw_staff_attendance_leave_applications
        WHERE bPending = 1 AND fklEmpCode = ?
    
        UNION ALL
    
        SELECT COUNT(*) AS count
        FROM nw_staff_attendance_parental_leave
        WHERE bPending = 1 AND fklEmpCode = ?
    ) AS combined_counts;`,

    alreadyTakeLeaveQ : ` SELECT SUM(count) AS count 
    FROM ( 
    SELECT COUNT(*) count FROM nw_staff_attendance_leave_applications
        WHERE dtLeaveDate = ? AND fklEmpCode = ?
    UNION ALL
    SELECT COUNT(*) AS count
    FROM nw_staff_attendance_parental_leave
    WHERE dtStartDate = ? AND fklEmpCode = ? 
    ) AS combined_counts;`,
    
    holidaysinBetweenLeave: `SELECT COUNT(*) AS holidays FROM nw_mams_leave WHERE dtLeaveDate >= ? AND dtLeaveDate <= ?`,
    holidaysinBetweenLeaveList: `SELECT dtLeaveDate AS holiday FROM nw_mams_leave WHERE dtLeaveDate >= ? AND dtLeaveDate <= ?`,
    applyLeave: `INSERT INTO nw_staff_attendance_leave_applications (fklEmpCode, dtFromDate, dtToDate, bApproval, dtAppliedDate, iLeaveDuration, vsReason, fklResponsibleOfficerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    checkPrefixHolidays: `SELECT DATE_FORMAT(dtLeaveDate, '%Y-%m-%d') AS holidays FROM nw_mams_leave WHERE dtLeaveDate >= ? AND dtLeaveDate < ?`,
    checkSuffixHolidays: `SELECT DATE_FORMAT(dtLeaveDate, '%Y-%m-%d') AS holidays FROM nw_mams_leave WHERE dtLeaveDate > ? AND dtLeaveDate <= ?`,
    applyForLeave: `INSERT INTO nw_staff_attendance_leave_applications (fklEmpCode,dtLeaveDate,bApproval,dtAppliedDate,iLeaveDuration,vsReason,vsType,fklReasonId,bPending, fklResponsibleOfficerId, vsSupporting) VALUES(?,?,?,?,?,?,?,?,1,?,?)`,
    applied: `SELECT DATE(dtAppliedDate) AS appliedDate, 
	MIN(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS startDate,  MAX(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS endDate, 
    vsReason AS reason, vsType AS leaveType, 
     CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproval = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproval = 1 THEN "APPROVED"
    END AS status,
     vsRejectionReason AS rejectionReason,
    vsLeaveHeader AS leaveHeader,
    vsSupporting AS pdfUrl
    FROM nw_staff_attendance_leave_applications 
    LEFT JOIN nw_mams_leave_header ON fklReasonId = pklLeaveHeaderId WHERE fklEmpCode = ?
    
    `,
    appliedbyrange: `SELECT DATE(dtAppliedDate) AS appliedDate, 
	MIN(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS startDate,  MAX(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS endDate, 
    vsReason AS reason, vsType AS leaveType, 
     CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproval = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproval = 1 THEN "APPROVED"
    END AS status,
     vsRejectionReason AS rejectionReason,
    vsLeaveHeader AS leaveHeader,
    vsSupporting AS pdfUrl
    FROM nw_staff_attendance_leave_applications 
    LEFT JOIN nw_mams_leave_header ON fklReasonId = pklLeaveHeaderId WHERE fklEmpCode = ? and 
    DATE_FORMAT(dtAppliedDate, '%Y-%m-%d') BETWEEN ? AND ? 
    
    
    `,
    appliedbyMonth: `SELECT DATE(dtAppliedDate) AS appliedDate, 
	MIN(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS startDate,  MAX(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS endDate, 
    vsReason AS reason, vsType AS leaveType, 
     CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproval = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproval = 1 THEN "APPROVED"
    END AS status,
     vsRejectionReason AS rejectionReason,
    vsLeaveHeader AS leaveHeader,
    vsSupporting AS pdfUrl
    FROM nw_staff_attendance_leave_applications 
    LEFT JOIN nw_mams_leave_header ON fklReasonId = pklLeaveHeaderId WHERE fklEmpCode = ? and 
    DATE_FORMAT(dtAppliedDate, '%Y-%m')= ? 
    
    `,
    appliedbyweek: `SELECT DATE(dtAppliedDate) AS appliedDate, 
	MIN(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS startDate,  MAX(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS endDate, 
    vsReason AS reason, vsType AS leaveType, 
     CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproval = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproval = 1 THEN "APPROVED"
    END AS status,
     vsRejectionReason AS rejectionReason,
    vsLeaveHeader AS leaveHeader,
    vsSupporting AS pdfUrl
    FROM nw_staff_attendance_leave_applications 
    LEFT JOIN nw_mams_leave_header ON fklReasonId = pklLeaveHeaderId WHERE fklEmpCode = ? and 
    dtAppliedDate >= CURDATE() - INTERVAL 6 DAY 
        AND dtAppliedDate < CURDATE() + INTERVAL 1 DAY
    
    `,
    appliedbycurDate: `SELECT DATE(dtAppliedDate) AS appliedDate, 
	MIN(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS startDate,  MAX(DATE_FORMAT(dtLeaveDate, '%Y-%m-%d')) AS endDate, 
    vsReason AS reason, vsType AS leaveType, 
     CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproval = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproval = 1 THEN "APPROVED"
    END AS status,
     vsRejectionReason AS rejectionReason,
    vsLeaveHeader AS leaveHeader,
    vsSupporting AS pdfUrl
    FROM nw_staff_attendance_leave_applications 
    LEFT JOIN nw_mams_leave_header ON fklReasonId = pklLeaveHeaderId WHERE fklEmpCode = ? and 
    date(dtAppliedDate) =CURDATE()
    
    `,
    parentalLeave: `SELECT DATE(dtAppliedDate) AS appliedDate, DATE(dtStartDate) AS startDate, DATE(dtEndDate) AS endDate, 'PL' AS leaveType,
    CASE
        WHEN bPending = 1 THEN "PENDING"
        WHEN bPending = 0 AND bApproved = 0 THEN "REJECTED"
        WHEN bPending = 0 AND bApproved = 1 THEN "APPROVED"
    END AS status
     FROM nw_staff_attendance_parental_leave WHERE fklEmpCode = ?`,
    applyForParentalLeaveMale: `INSERT INTO nw_staff_attendance_parental_leave (fklEmpCode, dtStartDate, dtEndDate, dtAppliedDate, vsSupporting) VALUES (?, ?, DATE_ADD(?, INTERVAL 14 DAY), NOW(), ?)`,
    applyForParentalLeaveFemale: `INSERT INTO nw_staff_attendance_parental_leave (fklEmpCode, dtStartDate, dtEndDate, dtAppliedDate, vsSupporting) VALUES (?, ?, DATE_ADD(?, INTERVAL 179 DAY), NOW(), ?)`,
    gender: `SELECT vsGender AS gender FROM nw_employee_personal_dtls pdtl 
            INNER JOIN nw_staff_attendance_dtl adtl ON adtl.fklEmployeeRegId = pdtl.pklEmployeeRegId
            WHERE adtl.pklEmpCode = ?`,
    otp: `INSERT INTO nw_staff_attendance_otp_confirmation (fklEmpCode, fklResponsibleOfficerId, vsOTP, bVerified, dtCreatedAt) VALUES (?, ?, LPAD(FLOOR(RAND() * 9999.99), 4, '0'), 0, NOW())`,
    verifyOTP: `UPDATE nw_staff_attendance_otp_confirmation SET bVerified = 1 WHERE fklEmpCode = ? AND vsOTP = ? AND pklStaffOtpConfirmationId = ? AND bVerified = 0`

}

// AND YEAR(dtLeaveDate) = YEAR(CURDATE())

module.exports = query