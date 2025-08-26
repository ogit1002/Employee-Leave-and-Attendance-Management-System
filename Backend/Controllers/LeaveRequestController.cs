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
    public class LeaveRequestController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public LeaveRequestController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        [HttpPost]
        [Route("AddLeave")]
        [Authorize(Roles = "Admin,Employee,Manager")]
        public async Task<IActionResult> AddLeave([FromBody] LeaveRequestDTO leaverequestdto)
        {
            var tempEmployee = await dbContext.Employees.FirstOrDefaultAsync(a => a.EmployeeID == leaverequestdto.EmployeeId);

            if (tempEmployee == null)
                return BadRequest(new { message = $"This Employee with the ID : {leaverequestdto.EmployeeId} is not in the database. Please add the employee first." });

            if (leaverequestdto == null)
                return BadRequest(new { message = "Leave request cannot be null" });

            int daysRequested = (leaverequestdto.EndDate.DayNumber - leaverequestdto.StartDate.DayNumber) + 1;
            if (daysRequested <= 0)
                return BadRequest(new { message = "End date must be after or equal to start date." });

            var leaveBalance = await dbContext.LeaveBalances
                .FirstOrDefaultAsync(lb => lb.EmployeeID == leaverequestdto.EmployeeId && lb.LeaveType == leaverequestdto.LeaveType);

            if (leaveBalance == null)
                return BadRequest(new { message = "No leave balance found for this leave type." });

            if (leaveBalance.Balance < daysRequested)
                return BadRequest(new { message = $"Insufficient leave balance. Available: {leaveBalance.Balance}, Requested: {daysRequested}" });

            var leaverequestDB = new LeaveRequest
            {
                EmployeeID = leaverequestdto.EmployeeId,
                LeaveType = leaverequestdto.LeaveType,
                StartDate = leaverequestdto.StartDate,
                EndDate = leaverequestdto.EndDate
            };

            await dbContext.LeaveRequests.AddAsync(leaverequestDB);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave request added successfully", data = leaverequestdto });
        }

        [HttpGet]
        [Route("GetAllLeaves")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllLeaves()
        {
            var leaverequests = await dbContext.LeaveRequests.ToListAsync();
            return Ok(new { message = "Leave requests fetched successfully", data = leaverequests });
        }

        [HttpGet]
        [Route("GetLeaveById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetLeaveById(int id)
        {
            var leaveRequest = await dbContext.LeaveRequests.FindAsync(id);
            if (leaveRequest == null)
                return NotFound(new { message = "Leave request not found." });

            return Ok(new { message = "Leave request fetched successfully", data = leaveRequest });
        }

        [HttpPut]
        [Route("UpdateLeave/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateLeave(int id, [FromBody] UpdateLeaveRequestDTO updateleaverequestdto)
        {
            if (updateleaverequestdto == null)
                return BadRequest(new { message = "Leave request cannot be null" });

            var leaverequest = await dbContext.LeaveRequests.FindAsync(id);
            if (leaverequest == null)
                return NotFound(new { message = "Leave request not found" });

            int daysRequested = (updateleaverequestdto.EndDate.DayNumber - updateleaverequestdto.StartDate.DayNumber) + 1;

            if (updateleaverequestdto.Status == "Approved" && leaverequest.Status != "Approved")
            {
                var leaveBalance = await dbContext.LeaveBalances
                    .FirstOrDefaultAsync(lb => lb.EmployeeID == leaverequest.EmployeeID && lb.LeaveType == leaverequest.LeaveType);

                if (leaveBalance == null)
                    return BadRequest(new { message = "No leave balance found for this leave type." });

                if (leaveBalance.Balance < daysRequested)
                    return BadRequest(new { message = $"Insufficient leave balance. Available: {leaveBalance.Balance}, Requested: {daysRequested}" });

                leaveBalance.Balance -= daysRequested;
                dbContext.LeaveBalances.Update(leaveBalance);
            }

            if ((updateleaverequestdto.Status == "Rejected" || updateleaverequestdto.Status == "Canceled") && leaverequest.Status == "Approved")
            {
                var leaveBalance = await dbContext.LeaveBalances
                    .FirstOrDefaultAsync(lb => lb.EmployeeID == leaverequest.EmployeeID && lb.LeaveType == leaverequest.LeaveType);

                if (leaveBalance != null)
                {
                    leaveBalance.Balance += daysRequested;
                    dbContext.LeaveBalances.Update(leaveBalance);
                }
            }

            leaverequest.LeaveType = updateleaverequestdto.LeaveType;
            leaverequest.StartDate = updateleaverequestdto.StartDate;
            leaverequest.EndDate = updateleaverequestdto.EndDate;
            leaverequest.Status = updateleaverequestdto.Status;

            dbContext.LeaveRequests.Update(leaverequest);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave request updated successfully", data = updateleaverequestdto });
        }

        [HttpDelete]
        [Route("DeleteLeave/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteLeave(int id)
        {
            var leaverequest = await dbContext.LeaveRequests.FindAsync(id);
            if (leaverequest == null)
                return NotFound(new { message = "Leave request not found" });

            dbContext.LeaveRequests.Remove(leaverequest);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave request deleted successfully" });
        }

        [HttpGet]
        [Route("GetMyLeaverequest")]
        [Authorize(Roles = "Employee, Manager")]
        public async Task<IActionResult> GetMyLeaverequest()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email claim is missing." });

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);

            if (employee == null)
                return NotFound(new { message = "Employee not found for the current user." });

            int employeeId = employee.EmployeeID;

            var leavereq = await dbContext.LeaveRequests
                .Where(s => s.EmployeeID == employeeId)
                .ToListAsync();

            return Ok(new { message = "Leave requests fetched successfully", data = leavereq });
        }
    }
}