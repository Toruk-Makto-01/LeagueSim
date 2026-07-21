import React, { useState, useEffect } from 'react';

export default function FixturePage() {
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFixture();
  }, []);

  const fetchFixture = () => {
    fetch('https://localhost:7230/api/League/1')
      .then(res => res.json())
      .then(data => setLeagueData(data))
      .catch(err => console.error("Fikstür çekilemedi:", err));
  };

  const handleGenerateFixture = () => {
    setLoading(true);
    fetch('https://localhost:7230/api/Fixture/1', {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          alert('Çift devreli lig fikstürü başarıyla oluşturuldu! ⚽');
          fetchFixture();
        } else {
          alert('Fikstür oluşturulamadı. Takım sayısının en az 18 olduğundan emin olun.');
        }
      })
      .catch(err => console.error("Hata:", err))
      .finally(() => setLoading(false));
  };

  const handlePlayWeek = (weekId) => {
    setLoading(true);
    fetch(`https://localhost:7230/api/Simulation/${weekId}`, {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          fetchFixture();
        } else {
          alert('Hafta oynatılırken hata oluştu.');
        }
      })
      .catch(err => console.error("Simülasyon hatası:", err))
      .finally(() => setLoading(false));
  };

  const handlePlaySeason = () => {
    if (!window.confirm("Tüm sezonu tek seferde oynamak istediğinize emin misiniz?")) return;

    setLoading(true);
    fetch('https://localhost:7230/api/Simulation/play-season/1', {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          alert('Sezon tamamlandı! Şampiyonu puan durumundan kontrol edebilirsin 🏆');
          fetchFixture();
        } else {
          alert('Sezon simülasyonunda hata oluştu.');
        }
      })
      .catch(err => console.error("Sezon hatası:", err))
      .finally(() => setLoading(false));
  };

  const hasWeeks = leagueData && leagueData.weeks && leagueData.weeks.length > 0;
  
  // Tüm haftaların oynanıp oynanmadığını kontrol ediyoruz
  const allWeeksPlayed = hasWeeks && leagueData.weeks.every(week => week.isPlayed);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">📅 Fikstür & Simülasyon</h1>
          <p className="text-slate-500 text-sm mt-1">Çift devreli maç takvimini yönet ve haftaları simüle et.</p>
        </div>

        <div className="flex gap-3">
          {(!hasWeeks || allWeeksPlayed) ? (
            <button 
              onClick={handleGenerateFixture}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition text-sm"
            >
              {loading ? 'Oluşturuluyor...' : '🚀 Fikstür Üret (Çift Devreli)'}
            </button>
          ) : (
            <button 
              onClick={handlePlaySeason}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition text-sm"
            >
              {loading ? 'Oynatılıyor...' : '🏆 Tüm Sezonu Oynat'}
            </button>
          )}
        </div>
      </div>

      {!hasWeeks ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center text-slate-400">
          <span className="text-4xl block mb-2">📋</span>
          Bu lig için henüz fikstür oluşturulmamış. Takımları tamamladıktan sonra yukarıdaki butona basarak fikstürü kurabilirsiniz.
        </div>
      ) : (
        <div className="space-y-6">
          {leagueData.weeks.map((week) => (
            <div key={week.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">Hafta {week.weekNumber}</h3>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${week.isPlayed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {week.isPlayed ? 'Oynandı ✓' : 'Oynanmadı'}
                  </span>

                  {!week.isPlayed && (
                    <button 
                      onClick={() => handlePlayWeek(week.id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow transition"
                    >
                      {loading ? 'Oynatılıyor...' : '⚡ Bu Haftayı Oynat'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {week.matches.map((match) => (
                  <div key={match.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 truncate w-2/5 text-right">
                      {match.homeTeamName || `Takım #${match.homeTeamId}`}
                    </span>
                    
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-blue-600 shadow-inner">
                      {match.isPlayed ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                    </div>

                    <span className="font-semibold text-slate-700 truncate w-2/5 text-left">
                      {match.awayTeamName || `Takım #${match.awayTeamId}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}