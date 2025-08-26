namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class UpdateShiftDTO
    {
        // This class is used for transferring data between the client and server for updating shifts
        public DateTime ShiftDate { get; set; } // Date of the shift
        public DateTime ShiftTime { get; set; } // Time of the shift
    }
}
