namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class UpdateLeaveRequestDTO
    {
        // This class is used for transferring data between the client and server for updating leave requests
        public string LeaveType { get; set; } // Type of leave
        public DateOnly StartDate { get; set; } // Start date of the leave
        public DateOnly EndDate { get; set; } // End date of the leave
        public string Status { get; set; } // Status of the leave request
    }
}
