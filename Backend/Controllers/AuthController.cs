using System.Runtime.CompilerServices;
using System.Security.Claims;
using Azure;
using EmployeeLeaveAndAttendanceManagementSystem.Data;
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
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        public AuthController(UserManager<IdentityUser> userManager,
            ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
        }

        // POST: {apibaseurl}/api/auth/login
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var identityUser = await userManager.FindByEmailAsync(request.Email);

            if (identityUser is not null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(identityUser, request.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(identityUser);
                    var jwtToken = tokenRepository.CreateJwtToken(identityUser, roles.ToList());

                    var response = new LoginResponseDto()
                    {
                        Email = request.Email,
                        Roles = roles.ToList(),
                        Token = jwtToken
                    };

                    return Ok(new { message = "Login successful.", data = response });
                }
            }
            return BadRequest(new { message = "Email or Password Incorrect" });
        }

        // GET all users EndPoint
        [HttpGet]
        [Route("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = userManager.Users.Select(user => new
            {
                user.Id,
                user.UserName,
                user.Email
            }).ToList();

            return Ok(new { message = "Users fetched successfully.", data = users });
        }

        // POST: {apibaseurl}/api/auth/request-password-reset
        [HttpPost]
        [Route("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            return Ok(new { message = "Password reset token generated successfully.", token = token });
        }

        // POST: {apibaseurl}/api/auth/reset-password
        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password has been reset successfully." });
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = "Password reset failed.", errors = errors });
        }

        // POST: {apibaseurl}/api/auth/change-password
        [HttpPost]
        [Route("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            // Get the currently authenticated user
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password changed successfully." });
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = "Failed to change password.", errors = errors });
        }

        // [Optional] Get Authenticated User Details EndPoint
        /*
        [HttpGet]
        [Route("user-details")]
        [Authorize]
        public async Task<IActionResult> GetUserDetails()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Email claim is missing." });
            }

            var userClaims = User.Claims.Select(c => new ClaimDto
            {
                Type = c.Type,
                Value = c.Value
            }).ToList();

            var response = new UserDetailsResponseDto
            {
                Claims = userClaims
            };

            return Ok(new { message = "User details fetched.", data = response });
        }
        */

        [HttpPost]
        [Route("generate-password-reset-link")]
        public async Task<IActionResult> GeneratePasswordResetLink([FromBody] PasswordResetRequestDto request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var resetLink = Url.Action(
                action: "ResetPassword",
                controller: "Auth",
                values: new { email = request.Email, token = token },
                protocol: Request.Scheme
            );

            return Ok(new { message = "Password reset link generated successfully.", resetLink = resetLink });
        }
    }
}