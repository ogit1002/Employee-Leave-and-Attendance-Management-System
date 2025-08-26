using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EmployeeLeaveAndAttendanceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;
using EmployeeLeaveAndAttendanceManagementSystem.Models.DTO;
using EmployeeLeaveAndAttendanceManagementSystem.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EmployeeLeaveAndAttendanceManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveBalanceController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public LeaveBalanceController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        [HttpPost]
        [Route("AddLeaveBalance")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddLeaveBalance([FromBody] LeaveBalanceDTO leavebalancedto)
        {
            var tempEmployee = await dbContext.Employees.FirstOrDefaultAsync(a => a.EmployeeID == leavebalancedto.EmployeeId);
            if (tempEmployee == null)
                return BadRequest(new { message = $"This Employee with the ID : {leavebalancedto.EmployeeId} is not in the database. Please add the employee first." });

            if (leavebalancedto == null)
                return BadRequest(new { message = "Leave request cannot be null" });

            var leavebalanceDB = new LeaveBalance
            {
                EmployeeID = leavebalancedto.EmployeeId,
                LeaveType = leavebalancedto.LeaveType,
                Balance = leavebalancedto.Balance
            };

            await dbContext.LeaveBalances.AddAsync(leavebalanceDB);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave balance added successfully", data = leavebalancedto });
        }

        [HttpGet]
        [Route("GetAllLeaveBalances")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllLeavebalances()
        {
            var allLeaveBalances = await dbContext.LeaveBalances.ToListAsync();
            return Ok(new { message = "Leave balances fetched successfully", data = allLeaveBalances });
        }

        [HttpGet]
        [Route("GetLeaveBalanceById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetLeaveBalanceById(int id)
        {
            var leavebalance = await dbContext.LeaveBalances.FindAsync(id);
            if (leavebalance == null)
                return NotFound(new { message = "Leave balance not found" });

            return Ok(new { message = "Leave balance fetched successfully", data = leavebalance });
        }

        [HttpPut]
        [Route("UpdateLeaveBalance/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLeaveBalance(int id, [FromBody] UpdateLeaveBalanceDTO updateleavebalancedto)
        {
            if (updateleavebalancedto == null)
                return BadRequest(new { message = "Leave balance data cannot be null" });

            var leavebalance = await dbContext.LeaveBalances.FindAsync(id);
            if (leavebalance == null)
                return NotFound(new { message = "Leave balance not found" });

            leavebalance.LeaveType = updateleavebalancedto.LeaveType;
            leavebalance.Balance = updateleavebalancedto.Balance;
            dbContext.LeaveBalances.Update(leavebalance);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave balance updated successfully", data = updateleavebalancedto });
        }

        [HttpDelete]
        [Route("DeleteLeaveBalance/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteLeaveBalance(int id)
        {
            var leavebalance = await dbContext.LeaveBalances.FindAsync(id);
            if (leavebalance == null)
                return NotFound(new { message = "Leave balance not found" });

            dbContext.LeaveBalances.Remove(leavebalance);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Leave balance deleted successfully" });
        }

        [HttpGet]
        [Route("GetMyLeaveBalance")]
        [Authorize(Roles = "Admin, Employee, Manager")]
        public async Task<IActionResult> GetMyLeaveBalance()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email claim is missing." });

            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
            if (employee == null)
                return NotFound(new { message = "Employee not found for the current user." });

            int employeeId = employee.EmployeeID;

            var leavebalance = await dbContext.LeaveBalances
                .Where(s => s.EmployeeID == employeeId)
                .ToListAsync();

            return Ok(new { message = "Leave balances fetched successfully", data = leavebalance });
        }
    }
}