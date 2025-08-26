using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace EmployeeLeaveAndAttendanceManagementSystem.Data
{
    // Defining AuthDbContext which inherits from IdentityDbContext.
    public class AuthDbContext : IdentityDbContext
    {
        // Constructor to initialize the DbContext with options
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        // Override the OnModelCreating method to customize the model creation
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Define role IDs for Employee, Manager, and Admin roles
            var employeeRoleId = "38e75b6c-b8ec-4951-c481-946a2f8e8642";
            var managerRoleId = "a850f27d-35b2-5335-b8cf-2cc11c8d1234";
            var adminRoleId = "a850f27d-35b2-5335-b8cf-2cc11c8d5678";

            // Create Admin, Manager, and Employee Roles
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = adminRoleId
                },
                new IdentityRole()
                {
                    Id = managerRoleId,
                    Name = "Manager",
                    NormalizedName = "MANAGER",
                    ConcurrencyStamp = managerRoleId
                },
                new IdentityRole()
                {
                    Id = employeeRoleId,
                    Name = "Employee",
                    NormalizedName = "EMPLOYEE",
                    ConcurrencyStamp = employeeRoleId
                }
            };
            builder.Entity<IdentityRole>().HasData(roles);

            // Create an Admin User
            var adminUserId = "f3d378fd-e54d-5f4c-9219-b2b2f92a017e";
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "admin@AttendanceAndLeave.com",
                Email = "admin@AttendanceAndLeave.com",
                NormalizedEmail = "ADMIN@ATTENDANCEANDLEAVE.COM",
                NormalizedUserName = "ADMIN@ATTENDANCEANDLEAVE.COM"
            };
            admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Password@1234");
            builder.Entity<IdentityUser>().HasData(admin);

            // Assign ONLY Admin Role to Admin User
            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                UserId = adminUserId,
                RoleId = adminRoleId
            });

            // Create an Employee User
            var employeeUserId = "b3d378fd-e54d-5f4c-9219-b2b2f92a017e";
            var employeeUser = new IdentityUser()
            {
                Id = employeeUserId,
                UserName = "employee@AttendanceAndLeave.com",
                Email = "employee@AttendanceAndLeave.com",
                NormalizedEmail = "EMPLOYEE@ATTENDANCEANDLEAVE.COM",
                NormalizedUserName = "EMPLOYEE@ATTENDANCEANDLEAVE.COM"
            };
            employeeUser.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(employeeUser, "EmployeePassword@1234");
            builder.Entity<IdentityUser>().HasData(employeeUser);

            // Assign ONLY Employee Role to Employee User
            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                UserId = employeeUserId,
                RoleId = employeeRoleId
            });

            // Create a Manager User
            var managerUserId = "d3d378fd-e54d-5f4c-9219-b2b2f92a017e";
            var managerUser = new IdentityUser()
            {
                Id = managerUserId,
                UserName = "manager@AttendanceAndLeave.com",
                Email = "manager@AttendanceAndLeave.com",
                NormalizedEmail = "MANAGER@ATTENDANCEANDLEAVE.COM",
                NormalizedUserName = "MANAGER@ATTENDANCEANDLEAVE.COM"
            };
            managerUser.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(managerUser, "ManagerPassword@7890");
            builder.Entity<IdentityUser>().HasData(managerUser);

            // Assign ONLY Manager Role to Manager User
            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                UserId = managerUserId,
                RoleId = managerRoleId
            });
        }
    }
}