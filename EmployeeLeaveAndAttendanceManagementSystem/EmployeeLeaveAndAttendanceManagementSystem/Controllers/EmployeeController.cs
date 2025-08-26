using EmployeeLeaveAndAttendanceManagementSystem.Data;
using EmployeeLeaveAndAttendanceManagementSystem.Models.Domain;
using EmployeeLeaveAndAttendanceManagementSystem.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeLeaveAndAttendanceManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<IdentityUser> userManager;

        public EmployeeController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            this.dbContext = context;
            this.userManager = userManager;
        }

        [HttpPost]
        [Route("AddEmployee")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployeeAndRegister([FromBody] EmployeeRegisterDTO employeeRegisterDto)
        {
            if (employeeRegisterDto == null)
                return BadRequest(new { message = "Employee data fields cannot be null" });

            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            var defaultPassword = GenerateRandomPassword();

            var user = new IdentityUser
            {
                UserName = employeeRegisterDto.Email?.Trim(),
                Email = employeeRegisterDto.Email?.Trim()
            };

            var identityResult = await userManager.CreateAsync(user, defaultPassword);

            if (identityResult.Succeeded)
            {
                identityResult = await userManager.AddToRoleAsync(user, "EMPLOYEE");

                if (identityResult.Succeeded)
                {
                    try
                    {
                        var employee = new Employee
                        {
                            Name = employeeRegisterDto.Name,
                            Email = employeeRegisterDto.Email,
                            Address = employeeRegisterDto.Address
                        };

                        await dbContext.Employees.AddAsync(employee);
                        await dbContext.SaveChangesAsync();

                        return Ok(new { message = "Employee registered successfully.", data = employeeRegisterDto, password = defaultPassword });
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
                    }
                }
                else if (identityResult.Errors.Any())
                {
                    return BadRequest(new { message = "Role assignment failed.", errors = identityResult.Errors.Select(e => e.Description) });
                }
            }
            else if (identityResult.Errors.Any())
            {
                return BadRequest(new { message = "User registration failed.", errors = identityResult.Errors.Select(e => e.Description) });
            }

            return BadRequest(new { message = "Unknown error" });
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string specialCharacters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~";

            var random = new Random();
            var password = new List<char>
            {
                uppercaseLetters[random.Next(uppercaseLetters.Length)],
                lowercaseLetters[random.Next(lowercaseLetters.Length)],
                digits[random.Next(digits.Length)],
                specialCharacters[random.Next(specialCharacters.Length)]
            };
            var allCharacters = uppercaseLetters + lowercaseLetters + digits + specialCharacters;
            for (int i = 4; i < length; i++)
            {
                password.Add(allCharacters[random.Next(allCharacters.Length)]);
            }
            return new string(password.OrderBy(x => random.Next()).ToArray());
        }

        [HttpGet]
        [Route("GetAllEmployees")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await dbContext.Employees.ToListAsync();
            if (employees == null || employees.Count == 0)
                return NotFound(new { message = "No employees found" });

            var getEmployeeDTOs = employees.Select(emp => new GetEmployeeDTO
            {
                Id = emp.EmployeeID,
                Name = emp.Name,
                Email = emp.Email,
                Address = emp.Address
            }).ToList();

            return Ok(new { message = "Employees fetched successfully", data = getEmployeeDTOs });
        }

        [HttpGet]
        [Route("GetEmployeeById/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await dbContext.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found." });

            var getEmployeeDTO = new GetEmployeeDTO
            {
                Id = employee.EmployeeID,
                Name = employee.Name,
                Email = employee.Email,
                Address = employee.Address
            };

            return Ok(new { message = "Employee fetched successfully", data = getEmployeeDTO });
        }

        [HttpPut]
        [Route("UpdateEmployee/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeDTO employeeDto)
        {
            if (employeeDto == null)
                return BadRequest(new { message = "Employee data fields cannot be null" });

            var employee = await dbContext.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            employee.Name = employeeDto.Name;
            employee.Email = employeeDto.Email;
            employee.Address = employeeDto.Address;
            dbContext.Employees.Update(employee);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Employee updated successfully", data = employeeDto });
        }

        [HttpDelete]
        [Route("DeleteEmployee/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await dbContext.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            // Find the Identity user by employee email
            var user = await userManager.FindByEmailAsync(employee.Email);
            if (user != null)
            {
                // Delete the user from AspNetUsers table
                var identityResult = await userManager.DeleteAsync(user);
                if (!identityResult.Succeeded)
                {
                    return StatusCode(500, new { message = "Failed to delete user from Identity.", errors = identityResult.Errors.Select(e => e.Description) });
                }
            }

            dbContext.Employees.Remove(employee);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Employee and user deleted successfully" });
        }
    }
}