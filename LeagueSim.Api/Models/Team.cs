namespace LeagueSim.Api.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int FoundationYear { get; set; }
        public string Colors { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public int Strength { get; set; } = 50;
        public int Morale { get; set; } = 50;
    }
}
