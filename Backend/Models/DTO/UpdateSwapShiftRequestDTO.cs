namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class UpdateSwapShiftRequestDTO
    {
        public int FromShiftID { get; set; }

        //  public int ToShiftID { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected
    }
}
