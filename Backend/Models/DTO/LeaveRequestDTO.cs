namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class LeaveRequestDTO
    {
        // This class is used for transferring data between the client and server for leave requests
        public int EmployeeId { get; set; } // Employee ID for the leave request
        public string LeaveType { get; set; } // Type of leave
        public DateOnly StartDate { get; set; } // Start date of the leave
        public DateOnly EndDate { get; set; } // End date of the leave
        
    }
}
