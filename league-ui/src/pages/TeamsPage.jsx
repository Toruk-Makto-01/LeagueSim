import React, { useState, useEffect } from 'react';
import AddTeamModal from '../components/AddTeamModal';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Takımları çeken fonksiyonu dışarıda tanımlıyoruz ki tekrar çağırabilelim
  const fetchTeams = () => {
    fetch('https://localhost:7230/api/Team')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error("Veri çekme hatası:", err));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Takım Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">Ligde mücadele eden takımları buradan yönetebilirsin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <span>+</span> Yeni Takım Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <img 
              src={team.logoUrl ? `https://via.placeholder.com/60?text=${team.name.substring(0,2)}` : "https://via.placeholder.com/60"} 
              alt={team.name} 
              className="w-16 h-16 object-contain rounded-full bg-gray-50 p-1 border"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
              <p className="text-sm text-gray-500">Kuruluş: {team.foundationYear} | Renk: {team.colors}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">Güç: {team.strength}</span>
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">Moral: {team.morale}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Takım Ekleme Modalı */}
      <AddTeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTeamAdded={fetchTeams} 
        existingTeams={teams}
      />
    </div>
  );
}