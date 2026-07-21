namespace LeagueSim.Api.Models
{
    public class Match
    {
        public int Id { get; set; }
        public int WeekId { get; set; }
        public Week? Week { get; set; }

        public int HomeTeamId { get; set; }
        public Team? HomeTeam { get; set; }

        public int AwayTeamId { get; set; }
        public Team? AwayTeam { get; set; }

        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }

        public bool IsPlayed { get; set; } = false;

    }
}
