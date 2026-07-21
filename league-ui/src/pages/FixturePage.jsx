import React, { useState, useEffect } from 'react';

export default function FixturePage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sayfa açıldığında sistemdeki ligleri çekelim ki ID'sini bilelim
  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = () => {
    fetch('https://localhost:7230/api/League')
      .then(res => res.json())
      .then(data => {
        setLeagues(data);
        if (data.length > 0) {
          const leagueId = data[0].id || data[0].Id;
          setSelectedLeagueId(leagueId);
        }
      })
      .catch(err => console.error("Ligler çekilemedi:", err));
  };

  // 1. Fikstür Üret
  const handleGenerateFixture = () => {
    if (!selectedLeagueId) {
      alert("Önce aktif bir lig bulunamadı!");
      return;
    }

    setLoading(true);
    fetch(`https://localhost:7230/api/Fixture/${selectedLeagueId}`, {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          alert('Fikstür başarıyla oluşturuldu! ⚽');
        } else {
          alert('Fikstür oluşturulurken hata oluştu.');
        }
      })
      .catch(err => console.error("Hata:", err))
      .finally(() => setLoading(false));
  };

  // 2. Tüm Sezonu Oynat (SimulationController -> play-season/{leagueId})
  const handlePlaySeason = () => {
    if (!selectedLeagueId) return;
    if (!window.confirm("Tüm sezonu tek seferde simüle etmek istediğinize emin misiniz?")) return;

    setLoading(true);
    fetch(`https://localhost:7230/api/Simulation/play-season/${selectedLeagueId}`, {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          alert('Sezon başarıyla oynatıldı ve şampiyon belirlendi! 🏆 Puan durumundan kontrol edebilirsin.');
        } else {
          alert('Sezon oynatılırken bir hata oluştu.');
        }
      })
      .catch(err => console.error("Hata:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📅 Fikstür & Simülasyon</h1>
          <p className="text-gray-500 text-sm mt-1">Lig takvimini oluştur ve sezonu simüle et.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fikstür Üretme Kartı */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Fikstür İşlemleri</h2>
          <p className="text-gray-500 text-sm mb-6">Takımlar arası eşleşmeleri belirleyerek maç takvimini kurar.</p>
          <button 
            onClick={handleGenerateFixture}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition"
          >
            {loading ? 'İşlem yapılıyor...' : '🚀 Fikstür Üret'}
          </button>
        </div>

        {/* Sezon Simülasyon Kartı */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sezon Simülasyonu</h2>
          <p className="text-gray-500 text-sm mb-6">Tüm maçları tek tuşla oynatır ve sezonu tamamlar.</p>
          <button 
            onClick={handlePlaySeason}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition"
          >
            {loading ? 'Simülasyon yapılıyor...' : '🏆 Tüm Sezonu Oynat'}
          </button>
        </div>
      </div>
    </div>
  );
}