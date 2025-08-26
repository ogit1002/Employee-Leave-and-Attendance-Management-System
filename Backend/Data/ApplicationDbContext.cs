using EmployeeLeaveAndAttendanceManagementSystem.Models.Domain;
using Microsoft.EntityFrameworkCore;  

namespace EmployeeLeaveAndAttendanceManagementSystem.Data
{
    //Defining the ApplicationDbContext class which interits from the DbContext.
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<AttendanceReport> AttendanceReports { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<LeaveBalance> LeaveBalances { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<SwapShiftRequest> SwapShiftRequests { get; set; }




        //Here we are overriding OnModelCreating which is actually present in DbContext.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaveRequest>()
                .HasOne(a => a.Employee)
                .WithMany(s => s.LeaveRequests)
                .HasForeignKey(b => b.EmployeeID);

            modelBuilder.Entity<AttendanceReport>()
               .HasOne(a => a.Employee)
               .WithMany(s => s.AttendanceReports)
               .HasForeignKey(b => b.EmployeeID);
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany(s => s.Attendances)
                .HasForeignKey(b => b.EmployeeID);

            modelBuilder.Entity<LeaveBalance>()
                .HasOne(a => a.Employee)
                .WithMany(s => s.LeaveBalances)
                .HasForeignKey(b => b.EmployeeID);

           
            modelBuilder.Entity<Shift>()
               .HasOne(a => a.Employee)
               .WithMany(s => s.Shifts)
               .HasForeignKey(b => b.EmployeeID);
        }
    }
}

