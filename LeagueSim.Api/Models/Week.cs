namespace LeagueSim.Api.Models
{
    public class Week
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; }
        public int LeagueId { get; set; }
        public League? League { get; set; }
        public bool IsPlayed { get; set; } = false;
        public List<Match> Matches { get; set; } = new();
    }
}
