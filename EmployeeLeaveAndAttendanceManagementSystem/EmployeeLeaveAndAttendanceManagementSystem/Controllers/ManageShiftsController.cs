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
    public class ManageShiftsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public ManageShiftsController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        [HttpPost]
        [Route("AddSwapShiftRequest")]
        [Authorize(Roles = "Admin, Employee, Manager")]
        public async Task<IActionResult> AddSwapShiftRequest([FromBody] SwapShiftRequestDTO requestDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email claim is missing." });

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
            if (employee == null)
                return NotFound(new { message = "Employee not found." });

            var swapRequest = new SwapShiftRequest
            {
                RequestingEmployeeID = employee.EmployeeID,
                FromShiftID = requestDto.FromShiftID,
                Reason = requestDto.Reason,
                Status = "Pending",
                RequestedAt = DateTime.UtcNow
            };

            await dbContext.SwapShiftRequests.AddAsync(swapRequest);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Swap shift request submitted successfully.", swapRequestId = swapRequest.SwapShiftRequestID });
        }

        [HttpGet]
        [Route("GetAllswapshiftrequests")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllswapshiftrequests()
        {
            var swapshiftrequests = await dbContext.SwapShiftRequests.ToListAsync();
            return Ok(new { message = "All swap shift requests fetched successfully.", data = swapshiftrequests });
        }

        [HttpGet]
        [Route("GetSwapShiftsRequestForEmployee/{employeeId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetSwapShiftsRequestForEmployee(int employeeId)
        {
            var employee = await dbContext.Employees.FindAsync(employeeId);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            var swapshiftrequests = await dbContext.SwapShiftRequests.Where(s => s.RequestingEmployeeID == employeeId).ToListAsync();
            if (swapshiftrequests == null || swapshiftrequests.Count == 0)
                return NotFound(new { message = "No shifts found for this employee" });

            var empswapshifts = await dbContext.Shifts.Where(s => s.EmployeeID == employeeId).ToListAsync();
            return Ok(new { message = "Employee's swap shifts fetched successfully.", data = empswapshifts });
        }

        [HttpGet]
        [Route("GetMySwapShiftRequests")]
        [Authorize(Roles = "Admin, Employee, Manager")]
        public async Task<IActionResult> GetMySwapShiftRequests()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email claim is missing." });

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
            if (employee == null)
                return NotFound(new { message = "Employee not found." });

            var swapRequests = await dbContext.SwapShiftRequests
                .Where(s => s.RequestingEmployeeID == employee.EmployeeID)
                .ToListAsync();
            return Ok(new { message = "My swap shift requests fetched successfully.", data = swapRequests });
        }

        [HttpPut]
        [Route("UpdateSwapshiftRequest/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateSwapshiftRequest(int id, [FromBody] UpdateSwapShiftRequestDTO updateswapshiftrequestdto)
        {
            if (updateswapshiftrequestdto == null)
                return BadRequest(new { message = "Swap shift request cannot be null" });

            var swapshiftrequest = await dbContext.SwapShiftRequests.FindAsync(id);
            if (swapshiftrequest == null)
                return NotFound(new { message = "Swap shift request not found" });

            swapshiftrequest.FromShiftID = updateswapshiftrequestdto.FromShiftID;
            swapshiftrequest.Reason = updateswapshiftrequestdto.Reason;
            swapshiftrequest.Status = updateswapshiftrequestdto.Status;

            dbContext.SwapShiftRequests.Update(swapshiftrequest);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Swap shift request updated successfully.", data = updateswapshiftrequestdto });
        }

        [HttpDelete]
        [Route("DeleteSwapShiftRequest/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSwapShiftRequest(int id)
        {
            var swapshiftreq = await dbContext.SwapShiftRequests.FindAsync(id);
            if (swapshiftreq == null)
                return NotFound(new { message = "Swap Shift request not found" });

            dbContext.SwapShiftRequests.Remove(swapshiftreq);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Swap Shift Request deleted successfully" });
        }
    }
}