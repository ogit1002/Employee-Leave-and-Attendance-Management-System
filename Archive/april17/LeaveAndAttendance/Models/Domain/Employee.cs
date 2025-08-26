namespace LeaveAndAttendance.Models.Domain
{
    public class Employee
    {
        // Entities of the employee
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        public ICollection<Shift> shifts { get; set; } = new List<Shift>();

    }
}
