using System.ComponentModel.DataAnnotations;

namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{

    // (DTO) for registering a new employee
    // Includes validation attributes 
    public class EmployeeRegisterDTO
    {
        // Required name field with a maximum length of 100 characters
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name length can't be more than 100.")]

        public string Name { get; set; }
        // Required field with email format validation
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]

        public string Email { get; set; }
        // Required field with a maximum length of 200 characters
        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, ErrorMessage = "Address length can't be more than 200.")]
        public string Address { get; set; }

        
    }
}
