namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class ShiftDTO
    {
        // This class is used for transferring data between the client and server for shifts
        public int EmployeeId { get; set; } // Employee ID for the shift
        public DateTime ShiftDate { get; set; } // Date of the shift
        public DateTime ShiftTime { get; set; } // Time of the shift
    }
}
