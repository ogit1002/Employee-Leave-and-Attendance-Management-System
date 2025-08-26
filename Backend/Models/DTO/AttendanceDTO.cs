namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{

    public class AttendanceDTO
    {
        public int EmployeeId { get; set; }
        public DateTime ClockInTime { get; set; } 
        public DateTime ClockOutTime { get; set; } 

    }
}
