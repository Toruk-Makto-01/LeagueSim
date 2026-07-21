import React, { useState, useEffect } from 'react';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Şimdilik 1 numaralı ligi baz alıyoruz
    const leagueId = 1;

    // 1. Puan durumunu çek
    fetch(`https://localhost:7230/api/Standing/${leagueId}`)
      .then(res => res.json())
      .then(data => {
        setStandings(data);
      })
      .catch(err => console.error("Puan durumu çekilemedi:", err));

    // 2. Şampiyonu kontrol et (Sezon bittiyse gelir)
    fetch(`https://localhost:7230/api/Standing/champion/${leagueId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Lig henüz bitmedi");
      })
      .then(data => {
        setChampion(data);
      })
      .catch(err => console.log(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏆 Puan Durumu & Şampiyonluk</h1>
          <p className="text-gray-500 text-sm mt-1">Sezonun güncel sıralamasını ve şampiyonunu buradan takip et.</p>
        </div>
      </div>

      {/* Şampiyonluk Kutlama Alanı (Eğer sezon bittiyse görünür) */}
      {champion && (
        <div className="mb-8 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="bg-white text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sezon Şampiyonu 👑</span>
            <h2 className="text-3xl font-extrabold mt-2">{champion.championTeam}</h2>
            <p className="text-yellow-100 text-sm mt-1">Tebrikler! Sezonu zirvede tamamladı.</p>
          </div>
          <div className="text-right bg-black bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-sm">Puan: <span className="font-bold text-lg">{champion.points}</span></p>
            <p className="text-sm">Averaj: <span className="font-bold">{champion.goalDifference}</span></p>
          </div>
        </div>
      )}

      {/* Puan Tablosu */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Sıra</th>
                <th className="py-4 px-6">Takım Adı</th>
                <th className="py-4 px-6 text-center">Oynanan</th>
                <th className="py-4 px-6 text-center">Galibiyet</th>
                <th className="py-4 px-6 text-center">Beraberlik</th>
                <th className="py-4 px-6 text-center">Mağlubiyet</th>
                <th className="py-4 px-6 text-center">Atılan</th>
                <th className="py-4 px-6 text-center">Yenilen</th>
                <th className="py-4 px-6 text-center">Averaj</th>
                <th className="py-4 px-6 text-center font-bold">Puan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {standings.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-400">
                    Puan durumu verisi bulunamadı veya henüz maç oynanmadı.
                  </td>
                </tr>
              ) : (
                standings.map((row, index) => (
                  <tr key={row.teamId || index} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{row.teamName}</td>
                    <td className="py-4 px-6 text-center">{row.played}</td>
                    <td className="py-4 px-6 text-center text-green-600 font-medium">{row.won}</td>
                    <td className="py-4 px-6 text-center text-amber-600 font-medium">{row.drawn}</td>
                    <td className="py-4 px-6 text-center text-red-600 font-medium">{row.lost}</td>
                    <td className="py-4 px-6 text-center">{row.goalsFor}</td>
                    <td className="py-4 px-6 text-center">{row.goalsAgainst}</td>
                    <td className="py-4 px-6 text-center font-medium">{row.goalDifference}</td>
                    <td className="py-4 px-6 text-center font-extrabold text-blue-600 text-base">{row.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}