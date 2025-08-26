using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.Domain
{

    // Represents the attendance report for an employee
    public class AttendanceReport

    {
        [Key] 
        public int ReportID { get; set; }
        public int EmployeeID { get; set; }

        public int DateRange { get; set; } 
        public int TotalAttendance { get; set; } 

        public int Absenteeism { get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; } = null!; 

    }
}
