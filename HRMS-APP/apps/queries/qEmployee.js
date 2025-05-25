const query = {

    getEmpDtl: `SELECT CONCAT(personal.vsFirstName, IFNULL(personal.vsMiddleName, ''), personal.vsLastName) AS Name,  
    personal.vsPhoneNumber AS Phone, gender.vsGenderName AS Gender, personal.vsEmail AS 'Email Id', personal.vsDOB AS 'Date of Birth',
    address.vsAddressLine1 AS 'Address Line 1', address.vsAddressLine2 AS 'Address Line 2', address.vsCity AS City, address.vsPIN AS PIN,
    designation.vsDesignationName AS Designation, emp.dtDateOfJoining AS 'Joining Date', dept.vsInternalDepartmentName AS Department
    FROM nw_staff_attendance_UUID staff
    LEFT JOIN nw_staff_attendance_dtl dtl ON staff.fklEmpCode = dtl.pklEmpCode
    LEFT JOIN nw_employee_personal_dtls personal ON dtl.fklEmployeeRegId = personal.pklEmployeeRegId
    LEFT JOIN nw_employee_address_dtls address ON dtl.fklEmployeeRegId = address.fklEmployeeRegId
    LEFT JOIN nw_employee_employment_dtls emp ON dtl.fklEmployeeRegId = emp.fklEmployeeRegId
    LEFT JOIN nw_mams_gender gender ON personal.vsGender = gender.pklGenderId
    LEFT JOIN nw_mams_designation designation ON emp.vsDesignation = designation.pklDesignationId
    LEFT JOIN nw_mams_internal_department dept ON emp.vsDepartment = dept.pklInternalDepartmentId
    WHERE staff.bEnabled = 1 AND dtl.pklEmpCode = ?;`,
}

module.exports = query