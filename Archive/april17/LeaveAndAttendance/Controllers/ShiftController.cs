using LeaveAndAttendance.Data;
using LeaveAndAttendance.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveAndAttendance.Controllers
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
        public async Task<IActionResult> AddShift([FromBody] ShiftDTO shift)
        {
            if (shift == null)
            {
                return BadRequest("Shift cannot be null");


            }

            var tempShiftObject = new Shift();
            tempShiftObject.ShiftDate = shift.ShiftDate;
            tempShiftObject.ShiftTime = shift.ShiftTime;    
            tempShiftObject.EmployeeId = shift.EmployeeId;  


            await dbContext.Shifts.AddAsync(tempShiftObject);
            await dbContext.SaveChangesAsync();
            return Ok(shift);
        }

        [HttpGet]
        [Route("GetShifts")]
        public async Task<ActionResult<IEnumerable<Shift>>> GetShifts()
        {
            var listofshifts = await dbContext.Shifts.ToListAsync();
            return listofshifts;
        }
    }

    public class ShiftDTO
    {
        public DateTime ShiftDate { get; set; }
        public DateTime ShiftTime { get; set; }


        public int EmployeeId { get; set; }

    }
}
