namespace LeagueSim.Api.Models
{
    public class League
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public List<Week> Weeks { get; set; } = new();
    }
}
