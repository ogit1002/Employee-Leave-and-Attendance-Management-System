using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{
    public class SwapShiftRequest
    {
        [Key]
        public int SwapShiftRequestID { get; set; }
        public int RequestingEmployeeID { get; set; }
        public int FromShiftID { get; set; }

//        public int ToShiftID { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        // public Employee Employee { get; set; } = null!;
    }
}