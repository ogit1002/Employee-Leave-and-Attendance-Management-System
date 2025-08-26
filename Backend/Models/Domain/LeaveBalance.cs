using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{
    // Represents the leave balance for an employee
    public class LeaveBalance
    {
        [Key]
        public int LeaveBalanceID { get; set; } 
        public int EmployeeID { get; set; } 
        public string LeaveType { get; set; } 
        public int Balance { get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; } = null!; 
    }
}
