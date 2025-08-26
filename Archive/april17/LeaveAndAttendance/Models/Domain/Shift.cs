namespace LeaveAndAttendance.Models.Domain
{
    public class Shift
    {
        public int Id { get; set; }
        public DateTime ShiftDate { get; set; }
        public DateTime ShiftTime { get; set; }

        public int EmployeeId { get; set; } 
        public Employee Employee { get; set; } = null!;
    }
}
