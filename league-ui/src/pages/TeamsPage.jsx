import React, { useState, useEffect } from 'react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [foundationYear, setFoundationYear] = useState('');
  const [colors, setColors] = useState('');
  const [logo, setLogo] = useState('');

  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch('https://localhost:7230/api/Team')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error("Takımlar çekilemedi:", err));
  };

  const handleAddOrUpdateTeam = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    const nameExists = teams.some(
      t => t.name.toLowerCase() === trimmedName.toLowerCase() && (!editingTeam || t.id !== editingTeam.id)
    );

    if (nameExists) {
      alert(`"${trimmedName}" adında bir takım zaten mevcut! Aynı isimle ikinci bir takım eklenemez.`);
      return;
    }

    if (editingTeam) {
      fetch(`https://localhost:7230/api/Team/${editingTeam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTeam.id,
          name: trimmedName,
          foundationYear: parseInt(foundationYear),
          colors,
          logo
        })
      })
        .then(res => {
          if (res.ok) {
            resetForm();
            fetchTeams();
          } else {
            alert('Takım güncellenirken hata oluştu.');
          }
        })
        .catch(err => console.error("Hata:", err));
    } else {
      fetch('https://localhost:7230/api/Team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          foundationYear: parseInt(foundationYear),
          colors,
          logo
        })
      })
        .then(res => {
          if (res.ok) {
            resetForm();
            fetchTeams();
          } else {
            alert('Takım eklenirken hata oluştu.');
          }
        })
        .catch(err => console.error("Hata:", err));
    }
  };

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setName(team.name);
    setFoundationYear(team.foundationYear);
    setColors(team.colors);
    setLogo(team.logo || '');
  };

  const resetForm = () => {
    setEditingTeam(null);
    setName('');
    setFoundationYear('');
    setColors('');
    setLogo('');
  };

  const handleDeleteTeam = (id) => {
    if (!window.confirm("Bu takımı silmek istediğinize emin misiniz?")) return;

    fetch(`https://localhost:7230/api/Team/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          fetchTeams();
        } else {
          alert('Takım silinemedi.');
        }
      })
      .catch(err => console.error("Hata:", err));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">🛡️ Takım Yönetimi (CRUD)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Lig için takımları ekleyin, güncelleyin ve yönetin. (Toplam: <span className="font-bold text-blue-600">{teams.length}</span> / En az 18 takım)
          </p>
        </div>

        {teams.length < 18 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm">
            ⚠️ Fikstür üretmek için en az 18 takım gereklidir. ({18 - teams.length} takım kaldı)
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm">
            ✅ Yeterli takım sayısına ulaşıldı! Fikstür oluşturabilirsiniz.
          </div>
        )}
      </div>

      <form onSubmit={handleAddOrUpdateTeam} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Takım Adı</label>
          <input 
            type="text" 
            placeholder="Örn: Fenerbahçe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Kuruluş Yılı</label>
          <input 
            type="number" 
            placeholder="1907" 
            value={foundationYear}
            onChange={(e) => setFoundationYear(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Renkler</label>
          <input 
            type="text" 
            placeholder="Sarı-Lacivert" 
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Logo URL</label>
          <input 
            type="text" 
            placeholder="Görsel linki..." 
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className={`flex-1 font-bold px-5 py-2.5 rounded-xl transition text-sm shadow-md ${
              editingTeam ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editingTeam ? 'Güncelle' : '+ Takım Ekle'}
          </button>
          {editingTeam && (
            <button 
              type="button" 
              onClick={resetForm}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center text-slate-400">
            <span className="text-4xl block mb-2">⚽</span>
            Henüz takım eklenmedi. Yukarıdaki formdan takımları eklemeye başlayın.
          </div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none'}} />
                  ) : (
                    <span className="text-xl font-extrabold text-slate-400">{team.name.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">Kuruluş: {team.foundationYear}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">🎨 Renkler: {team.colors}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition">
                <button 
                  onClick={() => handleEditClick(team)}
                  className="text-amber-600 hover:text-amber-800 text-xs font-semibold px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}