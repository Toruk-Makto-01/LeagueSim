using LeagueSim.Api.Models;
using LeagueSim.Api.Repositories;

namespace LeagueSim.Api.Services
{
    public class SimulationService
    {
        private readonly IMatchRepository _matchRepository;
        private readonly IWeekRepository _weekRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly Random _random = new Random();

        public SimulationService(
            IMatchRepository matchRepository,
            IWeekRepository weekRepository,
            ITeamRepository teamRepository)
        {
            _matchRepository = matchRepository;
            _weekRepository = weekRepository;
            _teamRepository = teamRepository;
        }

        public void PlayWeek(int weekId)
        {
            // haftayı bul
            // haftanın maçlarını bul
            // her maç için SimulateMatch fonksiyonunu çağır
            // haftayı IsPlayed = true yap

            var week = _weekRepository.GetById(weekId);
            if (week == null)
            {
                throw new ArgumentException($"Week with ID {weekId} not found.");
            }
            foreach (var match in week.Matches)
            {
                SimulateMatch(match);
            }
            week.IsPlayed = true;
            _weekRepository.Update(week);
        }

        public void PlayAllSeason(int leagueId)
        {
            // İlgili ligin henüz oynanmamış haftalarını sırayla getir
            var unplayedWeeks = _weekRepository.GetAll()
                .Where(w => w.LeagueId == leagueId && !w.IsPlayed)
                .OrderBy(w => w.WeekNumber)
                .ToList();

            foreach (var week in unplayedWeeks)
            {
                PlayWeek(week.Id);
            }
        }

        private void SimulateMatch(Match match)
        {
            // ev sahibi ve deplasman takımlarını bul
            // gol hesapla (formül)
            // maçskorlarını kaydet, IsPlayed = true yap
            // moral güncelle

            var hometeam = _teamRepository.GetById(match.HomeTeamId);
            var awayTeam = _teamRepository.GetById(match.AwayTeamId);

            // Eğer takımlardan biri bulunamazsa işlem yapma
            if (hometeam == null || awayTeam == null) return;

            int homeScore = CalculateGoals(hometeam, awayTeam, isHome: true);
            int awayScore = CalculateGoals(awayTeam, hometeam, isHome: false);

            UpdateMorale(hometeam, awayTeam, homeScore, awayScore);

            match.HomeScore = homeScore;
            match.AwayScore = awayScore;
            match.IsPlayed = true;
            _matchRepository.Update(match);

        }


        private int CalculateGoals(Team team, Team opponent, bool isHome)
        {
            // 1. Efektif Güç Salt gücün %75'i, Moralin %25'i takımların performansını belrler
            double teamPower = (team.Strength * 0.75) + (team.Morale * 0.25);
            double opponentPower = (opponent.Strength * 0.75) + (opponent.Morale * 0.25);

            // 2. Ev sahibi avantajı: Ev sahibi takımların gol atma olasılığı artar
            if(isHome)
            {
                teamPower += 5;
            }

            // 3. Rakibe Karşı Oran: Takım rakipten güçlüyse oran 1'in üzerinde, zayıfsa 1'in altında olur
            double powerRatio = teamPower / (opponentPower == 0 ? 1: opponentPower);

            // 4. Temel Gol BEklentisi: Gerçekçi futbol verisi (Ortalama takım 1.3 gol atar)
            double beklenenGoal = 1.3 * powerRatio;

            // 5. Rastgelelik: -1 ile +2 arası rastgele gol sekmesi
            int randomChance = _random.Next(-1, 3);

            // 6. Nihai Gol: Beklenti ile şansı toplar ve en yakın tam sayıya yuvarlar, negatif gol olmasın
            int finalGoal = (int)Math.Round(beklenenGoal + randomChance);

            return Math.Max(0, finalGoal); // negatif gol olmasın



            /* gol hesaplama formülü
            int maksGoal = 6;
            double beklenenGoal = ((team.Strength + team.Morale) / 200.0) * maksGoal;
            int goal = (int)Math.Round(beklenenGoal + (_random.NextDouble() - 0.5) * 2);
            goal = Math.Max(0, goal); // negatif gol olmasın
            return goal;
            */
        }

        private void UpdateMorale(Team hometeam, Team awayTeam, int homeScore, int awayScore)
        {
            // Maç sonucuna göre moral değişimi
            if (homeScore > awayScore)
            {
                hometeam.Morale += 4;
                awayTeam.Morale -= 2;
            }
            else if (homeScore < awayScore)
            {
                awayTeam.Morale += 4;
                hometeam.Morale -= 2;
            }
            else
            {
                hometeam.Morale += 1;
                awayTeam.Morale += 1;
            }
            // sınırlar 30-100
            hometeam.Morale = Math.Clamp(hometeam.Morale, 30, 100);
            awayTeam.Morale = Math.Clamp(awayTeam.Morale, 30, 100);

            _teamRepository.Update(hometeam);
            _teamRepository.Update(awayTeam);

        }
    }
}
