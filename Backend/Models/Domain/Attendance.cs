using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{
    // attendance record for an employee
    public class Attendance
    {
        [Key]
        public int AttendanceID { get; set; } 
        public int EmployeeID { get; set; } 
        public DateTime ClockInTime { get; set; } 
        public DateTime ClockOutTime { get; set; } 
        public TimeSpan WorkHours{ get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; } = null!; 

        
        public void CalculateWorkHours()
        {
            WorkHours = ClockOutTime - ClockInTime;
        }
    }

}
