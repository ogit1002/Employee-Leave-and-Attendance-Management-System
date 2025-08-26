namespace EmployeeLeaveAndAttendanceManagementSystem.Models.DTO
{
    public class UserDetailsResponseDto
    {
            public List<ClaimDto> Claims { get; set; }
     }

        public class ClaimDto
        {
            public string Type { get; set; }
            public string Value { get; set; }
        }
    }

