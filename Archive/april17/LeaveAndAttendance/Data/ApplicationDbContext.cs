using LeaveAndAttendance.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace LeaveAndAttendance.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Shift> Shifts { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Shift>()
                .HasOne(a => a.Employee)
                .WithMany(b => b.shifts)
                .HasForeignKey(c => c.EmployeeId);

        }
    }
}
