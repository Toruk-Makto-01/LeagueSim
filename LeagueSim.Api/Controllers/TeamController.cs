using LeagueSim.Api.Models;
using LeagueSim.Api.Services;
using LeagueSim.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System;

namespace LeagueSim.Api.Controllers
{
    [ApiController]
    [Route("api/Team")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _service;
        private readonly ITeamRepository _teamRepository;

        public TeamController(ITeamService service, ITeamRepository teamRepository)
        {
            _service = service;
            _teamRepository = teamRepository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var teams = _service.GetAll();
            return Ok(teams);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var team = _service.GetById(id);
            if (team == null)
                return NotFound();

            return Ok(team);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromForm] string name, [FromForm] int foundationYear, [FromForm] string colors, [FromForm] int strength, IFormFile? logoFile) // <-- Buraya ? eklendi
        {
            string logoPath = string.Empty;

            if (logoFile != null && logoFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + logoFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await logoFile.CopyToAsync(stream);
                }

                logoPath = "/uploads/" + uniqueFileName;
            }

            var team = new Team
            {
                Name = name,
                FoundationYear = foundationYear,
                Colors = colors,
                Strength = strength,
                Morale = 50,
                Logo = logoPath // Logo seçilmediyse boş string ("") olarak kaydedilir
            };

            _service.Add(team);
            return Ok(team);
        }

        [HttpPost("reset-morales")]
        public IActionResult ResetMorales()
        {
            var teams = _teamRepository.GetAll();
            foreach (var team in teams)
            {
                team.Morale = 50;
                _teamRepository.Update(team);
            }

            return Ok("Tüm takımların morali yeni sezon için 50'ye sıfırlandı!");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string name, [FromForm] int foundationYear, [FromForm] string colors, [FromForm] int strength, IFormFile? logoFile) // <-- Buraya ? eklendi
        {
            var existingTeam = _service.GetById(id);
            if (existingTeam == null)
                return NotFound();

            string logoPath = existingTeam.Logo; // Yeni logo seçilmezse eskisini korur

            if (logoFile != null && logoFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + logoFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await logoFile.CopyToAsync(stream);
                }

                logoPath = "/uploads/" + uniqueFileName;
            }

            existingTeam.Name = name;
            existingTeam.FoundationYear = foundationYear;
            existingTeam.Colors = colors;
            existingTeam.Strength = strength;
            existingTeam.Logo = logoPath;

            _service.Update(existingTeam);
            return Ok(existingTeam);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return Ok();
        }
    }
}