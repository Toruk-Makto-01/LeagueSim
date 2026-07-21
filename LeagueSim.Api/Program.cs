using LeagueSim.Api.Data;
using Microsoft.EntityFrameworkCore;
using LeagueSim.Api.Repositories;
using LeagueSim.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LeagueSimContext>(options =>
    options.UseSqlite("Data Source=leaguesim.db"));

builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<ITeamService, TeamService>();

builder.Services.AddScoped<ILeagueRepository, LeagueRepository>();
builder.Services.AddScoped<ILeagueService, LeagueService>();

builder.Services.AddScoped<IWeekRepository, WeekRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();

builder.Services.AddScoped<SimulationService>();

builder.Services.AddScoped<FixtureService>();

builder.Services.AddScoped<StandingService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBlazor", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
           System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LeagueSimContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowBlazor");

app.UseHttpsRedirection();

app.UseCors("AllowAll"); // CORS middleware should be placed before UseAuthorization

app.UseAuthorization();

app.UseStaticFiles(); // wwwroot klasörünü tarayıcıya açar (app.UseRouting() veya app.MapControllers() un önüne ekleyin)

app.MapControllers();

app.Run();
