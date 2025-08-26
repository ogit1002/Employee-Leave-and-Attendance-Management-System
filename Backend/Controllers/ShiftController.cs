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
    public class ShiftController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public ShiftController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        [HttpPost]
        [Route("AddShift")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> AddShift([FromBody] ShiftDTO shiftdto)
        {
            var tempShift = await dbContext.Employees.FirstOrDefaultAsync(a => a.EmployeeID == shiftdto.EmployeeId);
            if (tempShift == null)
                return BadRequest(new { message = $"This Employee with the ID : {shiftdto.EmployeeId} is not in the database. Please add the employee first." });

            if (shiftdto == null)
                return BadRequest(new { message = "Shift request cannot be null" });

            var shiftDB = new Shift
            {
                EmployeeID = shiftdto.EmployeeId,
                ShiftDate = shiftdto.ShiftDate,
                ShiftTime = shiftdto.ShiftTime
            };

            await dbContext.Shifts.AddAsync(shiftDB);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Shift added successfully.", data = shiftdto });
        }

        [HttpGet]
        [Route("GetAllShift")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllShift()
        {
            var shifts = await dbContext.Shifts.ToListAsync();
            return Ok(new { message = "All shifts fetched successfully.", data = shifts });
        }

        [HttpGet]
        [Route("GetShiftById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetShiftById(int id)
        {
            var shift = await dbContext.Shifts.FindAsync(id);
            if (shift == null)
                return NotFound(new { message = "Shift not found" });

            return Ok(new { message = "Shift fetched successfully.", data = shift });
        }

        [HttpGet]
        [Route("GetShiftsForEmployee/{employeeId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetShiftsForEmployee(int employeeId)
        {
            var employee = await dbContext.Employees.FindAsync(employeeId);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            var shifts = await dbContext.Shifts.Where(s => s.EmployeeID == employeeId).ToListAsync();
            if (shifts == null || shifts.Count == 0)
                return NotFound(new { message = "No shifts found for this employee" });

            return Ok(new { message = "Employee's shifts fetched successfully.", data = shifts });
        }

        [HttpGet]
        [Route("GetMyShifts")]
        [Authorize(Roles = "Employee,Manager,Admin")]
        public async Task<IActionResult> GetMyShifts()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email claim is missing." });

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
            if (employee == null)
                return NotFound(new { message = "Employee not found." });

            var empshifts = await dbContext.Shifts
                .Where(s => s.EmployeeID == employee.EmployeeID)
                .ToListAsync();
            return Ok(new { message = "My shifts fetched successfully.", data = empshifts });
        }

        [HttpPut]
        [Route("UpdateShift/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateShift(int id, [FromBody] UpdateShiftDTO updateshiftdto)
        {
            if (updateshiftdto == null)
                return BadRequest(new { message = "Shift request cannot be null" });

            var shift = await dbContext.Shifts.FindAsync(id);
            if (shift == null)
                return NotFound(new { message = "Shift not found" });

            shift.ShiftDate = updateshiftdto.ShiftDate;
            shift.ShiftTime = updateshiftdto.ShiftTime;

            dbContext.Shifts.Update(shift);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Shift updated successfully.", data = updateshiftdto });
        }

        [HttpDelete]
        [Route("DeleteShift/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShift(int id)
        {
            var shift = await dbContext.Shifts.FindAsync(id);
            if (shift == null)
                return NotFound(new { message = "Shift not found" });

            dbContext.Shifts.Remove(shift);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Shift deleted successfully" });
        }
    }
}