using EmployeeLeaveAndAttendanceManagementSystem.Data;
using EmployeeLeaveAndAttendanceManagementSystem.Models.Domain;
using EmployeeLeaveAndAttendanceManagementSystem.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeLeaveAndAttendanceManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceReportController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public AttendanceReportController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        // Adds a new attendance report for an employee
        [HttpPost]
        [Route("AddAttendanceReport")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> AddAttendanceReport([FromBody] AttendanceReportDTO attendancereportdto)
        {
            var tempAttendanceReport = await dbContext.Employees.FirstOrDefaultAsync(a => a.EmployeeID == attendancereportdto.EmployeeId);

            if (tempAttendanceReport == null)
            {
                var errormessage = $"This Employee with the ID : {attendancereportdto.EmployeeId} is not in the database. Please add the employee first.";
                return BadRequest(new { message = errormessage });
            }

            if (attendancereportdto == null)
            {
                return BadRequest(new { message = "Attendance Report request cannot be null" });
            }

            var attendancereportDB = new AttendanceReport
            {
                EmployeeID = attendancereportdto.EmployeeId,
                DateRange = attendancereportdto.DateRange,
                Absenteeism = attendancereportdto.Absenteeism,
                TotalAttendance = attendancereportdto.TotalAttendance
            };

            await dbContext.AttendanceReports.AddAsync(attendancereportDB);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Attendance report added successfully", data = attendancereportdto });
        }

        // Retrieves all attendance reports
        [HttpGet]
        [Route("GetAllAttendanceReport")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllAttendanceReport()
        {
            var attendancereports = await dbContext.AttendanceReports.ToListAsync();
            return Ok(new { message = "Attendance reports fetched successfully", data = attendancereports });
        }

        // Retrieves a specific attendance report by its ID
        [HttpGet]
        [Route("GetAttendanceReportById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAttendanceReportById(int id)
        {
            var attendancereport = await dbContext.AttendanceReports.FindAsync(id);
            if (attendancereport == null)
            {
                return NotFound(new { message = "Attendance report not found." });
            }

            AttendanceReportDTO attendanceReportDTO = new AttendanceReportDTO
            {
                EmployeeId = attendancereport.EmployeeID,
                DateRange = attendancereport.DateRange,
                Absenteeism = attendancereport.Absenteeism,
                TotalAttendance = attendancereport.TotalAttendance
            };

            return Ok(new { message = "Attendance report fetched successfully", data = attendanceReportDTO });
        }

        // Updates an existing attendance report
        [HttpPut]
        [Route("UpdateAttendanceReport/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateAttendanceReport(int id, [FromBody] UpdateAttendanceReportDTO attendancereportdto)
        {
            var existingattendancereport = await dbContext.AttendanceReports.FindAsync(id);
            if (existingattendancereport == null)
            {
                return NotFound(new { message = $"Attendance report with id {id} not found." });
            }

            existingattendancereport.DateRange = attendancereportdto.DateRange;
            existingattendancereport.TotalAttendance = attendancereportdto.TotalAttendance;
            existingattendancereport.Absenteeism = attendancereportdto.Absenteeism;

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Attendance report updated successfully", data = existingattendancereport });
        }

        // Deletes an attendance report by its ID
        [HttpDelete]
        [Route("DeleteAttendanceReport/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAttendanceReport(int id)
        {
            var existingattendancereport = await dbContext.AttendanceReports.FindAsync(id);
            if (existingattendancereport == null)
            {
                return NotFound(new { message = $"Attendance report with id {id} not found." });
            }

            dbContext.AttendanceReports.Remove(existingattendancereport);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Attendance report deleted successfully" });
        }
    }
}