using EmployeeLeaveAndAttendanceManagementSystem.Models.Domain;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{

    // Data Transfer Object for LeaveBalance
    public class LeaveBalanceDTO
    {
        public int EmployeeId { get; set; } // ID of the employee
        public string LeaveType { get; set; } // Type of leave 
        public int Balance { get; set; } // Remaining balance of the leave type
    }
}
