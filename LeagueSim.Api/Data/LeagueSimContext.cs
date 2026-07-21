using Microsoft.EntityFrameworkCore;
using LeagueSim.Api.Models;

namespace LeagueSim.Api.Data
{
    public class LeagueSimContext : DbContext
    {
        public LeagueSimContext(DbContextOptions<LeagueSimContext> options) : base(options) { }

        public DbSet<Team> Teams => Set<Team>();
        public DbSet<League> Leagues => Set<League>();
        public DbSet<Week> Weeks => Set<Week>();
        public DbSet<Match> Matches => Set<Match>();

    }
}
