using LeaveAndAttendance.Data;
using LeaveAndAttendance.Models.Domain;
using LeaveAndAttendance.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public EmployeeController(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        [HttpPost]
        [Route("AddEmployee")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeDTO employeeDto)
        {
            var employeeobjforDB = new Employee();
            employeeobjforDB.Name = employeeDto.Name;
            employeeobjforDB.Email = employeeDto.Email;
            employeeobjforDB.Address = employeeDto.Address;

            if (employeeobjforDB == null)
            {
                return BadRequest("Zoo cannot be null");
            }
            // Assuming you have a DbContext instance named _context
            await dbContext.Employees.AddAsync(employeeobjforDB);
            await dbContext.SaveChangesAsync();
            return Ok(employeeDto);
        }

        [HttpGet]
        [Route("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await dbContext.Employees.ToListAsync();
            return Ok(employees);
        }
    }
}
