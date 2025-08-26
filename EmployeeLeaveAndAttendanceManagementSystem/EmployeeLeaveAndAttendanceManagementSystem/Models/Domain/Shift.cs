using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{
    public class Shift
    {
        [Key]
        public int ShiftID { get; set; } 
        public int EmployeeID { get; set; } 
        public DateTime ShiftDate { get; set; }
        public DateTime ShiftTime { get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; } = null!; 

    }
}
