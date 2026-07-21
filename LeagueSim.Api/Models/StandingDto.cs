namespace LeagueSim.Api.Models
{
    public class StandingDto
    {
        public int TeamId { get; set; }
        public required string TeamName { get; set; } // 'required'
        public string? Logo { get; set; } // UI tarafında logo göstermek için 
        public int Played { get; set; }       // Oynanan Maç (O)
        public int Won { get; set; }          // Galibiyet (G)
        public int Drawn { get; set; }        // Beraberlik (B)
        public int Lost { get; set; }         // Mağlubiyet (M)
        public int GoalsFor { get; set; }     // Atılan Gol (A)
        public int GoalsAgainst { get; set; } // Yenen Gol (Y)
        public int GoalDifference => GoalsFor - GoalsAgainst; // Averaj
        public int Points => (Won * 3) + Drawn; // Puan (P)
    }
}