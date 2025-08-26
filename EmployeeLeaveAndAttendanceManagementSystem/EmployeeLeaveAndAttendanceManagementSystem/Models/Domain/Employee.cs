using System.ComponentModel.DataAnnotations;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{
    public class Employee
    {
        // Entities of the employee
        [Key]
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        // Collection of leave requests submitted by the employee.
        // This establishes a one-to-many relationship between Employee and LeaveRequest

        public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
        public ICollection<AttendanceReport> AttendanceReports { get; set; } = new List<AttendanceReport>();

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

        public ICollection<LeaveBalance> LeaveBalances { get; set; } = new List<LeaveBalance>();


        public ICollection<Shift> Shifts { get; set; } = new List<Shift>();

    }
}
