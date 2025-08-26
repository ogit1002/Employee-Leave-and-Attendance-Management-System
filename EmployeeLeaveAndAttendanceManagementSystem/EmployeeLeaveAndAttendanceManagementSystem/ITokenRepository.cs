using Microsoft.AspNetCore.Identity;

namespace EmployeeLeaveAndAttendanceManagementSystem
{
    // Defining an interface named ITokenRepository
    public interface ITokenRepository
    {

        // Declaring a method signature for creating a JWT token
        string CreateJwtToken(IdentityUser user, List<string> roles);

    }
}
