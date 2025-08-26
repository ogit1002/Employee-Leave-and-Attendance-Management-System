namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class UpdateAttendanceReportDTO
    {
        //public DateOnly StartDate { get; set; }
        //public DateOnly EndDate { get; set; }
        public int DateRange { get; set; } // Number of days in the report

        public int TotalAttendance { get; set; }

        public int Absenteeism { get; set; }

    }
}
