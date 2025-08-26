using System.Security.Claims;
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
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public AttendanceController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        // Add Attendance
        [HttpPost]
        [Route("AddAttendance")]
        [Authorize(Roles = "Admin,Employee,Manager")]
        public async Task<IActionResult> AddAttendance([FromBody] AttendanceDTO attendancedto)
        {
            if (attendancedto == null)
            {
                return BadRequest(new { message = "Attendance request cannot be null" });
            }

            var tempAttendance = await dbContext.Employees.FirstOrDefaultAsync(a => a.EmployeeID == attendancedto.EmployeeId);

            if (tempAttendance == null)
            {
                var errormessage = $"The Employee with ID: {attendancedto.EmployeeId} is not in the database. Please add the employee first.";
                return BadRequest(new { message = errormessage });
            }

            var attendanceDB = new Attendance
            {
                EmployeeID = attendancedto.EmployeeId,
                ClockInTime = attendancedto.ClockInTime,
                ClockOutTime = attendancedto.ClockOutTime
            };

            attendanceDB.CalculateWorkHours();
            await dbContext.Attendances.AddAsync(attendanceDB);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Attendance added successfully", data = attendancedto });
        }

        // Get all attendances
        [HttpGet]
        [Route("GetAllAttendance")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllAttendance()
        {
            var attendances = await dbContext.Attendances.ToListAsync();
            return Ok(new { message = "Attendance records fetched successfully", data = attendances });
        }

        // Get attendance by id
        [HttpGet]
        [Route("GetAttendanceById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAttendanceById(int id)
        {
            var attendance = await dbContext.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound(new { message = "Attendance not found" });
            }
            return Ok(new { message = "Attendance record fetched successfully", data = attendance });
        }

        // Update attendance by id
        [HttpPut]
        [Route("UpdateAttendance/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] UpdateAttendanceDTO updateattendancedto)
        {
            var attendance = await dbContext.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound(new { message = $"Attendance record with Id {id} not found." });
            }

            attendance.ClockInTime = updateattendancedto.ClockInTime;
            attendance.ClockOutTime = updateattendancedto.ClockOutTime;
            attendance.CalculateWorkHours();
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Attendance updated successfully", data = attendance });
        }

        // Delete attendance by id
        [HttpDelete]
        [Route("DeleteAttendanceById/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployeeById(int id)
        {
            var attendance = await dbContext.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound(new { message = "Attendance not found" });
            }
            dbContext.Attendances.Remove(attendance);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Attendance deleted successfully" });
        }

        // Get my attendance (for current employee)
        [HttpGet]
        [Route("GetMyAttendance")]
        [Authorize(Roles = "Employee, Manager")]
        public async Task<IActionResult> GetMyAttendance()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Email claim is missing." });
            }

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);

            if (employee == null)
            {
                return NotFound(new { message = "Employee not found for the current user." });
            }

            int employeeId = employee.EmployeeID;

            var attendances = await dbContext.Attendances
                .Where(s => s.EmployeeID == employeeId)
                .ToListAsync();

            return Ok(new { message = "Attendance records fetched successfully", data = attendances });
        }
    }
}