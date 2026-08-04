import React, { useState, useEffect } from 'react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [foundationYear, setFoundationYear] = useState('');
  const [colors, setColors] = useState('');
  const [strength, setStrength] = useState(50);
  const [logoFile, setLogoFile] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  // Sıralama state'leri
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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
    const yearNum = parseInt(foundationYear);
    const strengthNum = parseInt(strength);

    if (isNaN(yearNum) || foundationYear.length !== 4 || yearNum < 1800 || yearNum > 2026) {
      alert("⚠️ Lütfen geçerli 4 haneli bir kuruluş yılı girin (Örn: 1905).");
      return;
    }

    if (isNaN(strengthNum) || strengthNum < 1 || strengthNum > 100) {
      alert("⚠️ Takım gücü 1 ile 100 arasında olmalıdır!");
      return;
    }

    const nameExists = teams.some(
      t => t.name.toLowerCase() === trimmedName.toLowerCase() && (!editingTeam || t.id !== editingTeam.id)
    );

    if (nameExists) {
      alert(`"${trimmedName}" adında bir takım zaten mevcut! Aynı isimle ikinci bir takım eklenemez.`);
      return;
    }

    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('foundationYear', yearNum);
    formData.append('colors', colors);
    formData.append('strength', strengthNum);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    }

    const url = editingTeam 
      ? `https://localhost:7230/api/Team/${editingTeam.id}` 
      : 'https://localhost:7230/api/Team';
    
    const method = editingTeam ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      body: formData
    })
      .then(res => {
        if (res.ok) {
          resetForm();
          fetchTeams();
        } else {
          alert('İşlem sırasında sunucu hatası oluştu.');
        }
      })
      .catch(err => console.error("Hata:", err));
  };

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setName(team.name);
    setFoundationYear(team.foundationYear.toString());
    setColors(team.colors);
    setStrength(team.strength || 50);
    setLogoFile(null);
  };

  const resetForm = () => {
    setEditingTeam(null);
    setName('');
    setFoundationYear('');
    setColors('');
    setStrength(50);
    setLogoFile(null);
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

  // Metinsel renk girdisinden CSS renk kodları üreten yardımcı fonksiyon
  const getBadgeColors = (colorText) => {
    if (!colorText) return ['#94a3b8', '#cbd5e1']; // Varsayılan gri tonları
    
    const text = colorText.toLowerCase();
    let codes = [];

    if (text.includes('sarı')) codes.push('#eab308');
    if (text.includes('lacivert')) codes.push('#1e3a8a');
    if (text.includes('kırmızı')) codes.push('#ef4444');
    if (text.includes('beyaz')) codes.push('#ffffff');
    if (text.includes('siyah')) codes.push('#0f172a');
    if (text.includes('mavi')) codes.push('#3b82f6');
    if (text.includes('yeşil')) codes.push('#22c55e');
    if (text.includes('mor')) codes.push('#a855f7');
    if (text.includes('turuncu')) codes.push('#f97316');
    if (text.includes('bordo')) codes.push('#831843');
    if (text.includes('gri')) codes.push('#64748b');

    // Eğer eşleşen renk bulunamadıysa varsayılan iki şık renk verelim
    if (codes.length === 0) {
      return ['#3b82f6', '#64748b'];
    }
    
    // Tek renkse yanına uyumlu bir ton ekleyelim ki görsel zengin olsun
    if (codes.length === 1) {
      codes.push('#334155');
    }

    return codes;
  };

  // Sıralama Algoritması
  const sortedTeams = [...teams].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

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

      <form onSubmit={handleAddOrUpdateTeam} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
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
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Güç (1 - 100)</label>
          <input 
            type="number" 
            min="1"
            max="100"
            placeholder="75" 
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Logo Dosyası</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className={`flex-1 font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-md ${
              editingTeam ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editingTeam ? 'Güncelle' : '+ Ekle'}
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

      {teams.length > 0 && (
        <div className="flex flex-wrap items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sıralama Ölçütü:</span>
            <button 
              onClick={() => setSortBy('name')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${sortBy === 'name' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              İsim
            </button>
            <button 
              onClick={() => setSortBy('strength')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${sortBy === 'strength' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              Güç
            </button>
            <button 
              onClick={() => setSortBy('foundationYear')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${sortBy === 'foundationYear' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              Kuruluş Yılı
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Yön:</span>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition shadow-sm flex items-center gap-1"
            >
              {sortOrder === 'asc' ? '⬆️ Artan (A-Z / Küçükten Büyüğe)' : '⬇️ Azalan (Z-A / Büyükten Küçüğe)'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeams.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center text-slate-400">
            <span className="text-4xl block mb-2">⚽</span>
            Henüz takım eklenmedi. Yukarıdaki formdan takımları eklemeye başlayın.
          </div>
        ) : (
          sortedTeams.map((team) => {
            const teamColors = getBadgeColors(team.colors);
            return (
              <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {team.logo && team.logo.trim() !== "" ? (
                      <img 
                        src={`https://localhost:7230${team.logo}`} 
                        alt={team.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }} 
                      />
                    ) : (
                      <span className="text-xl font-extrabold text-slate-400">{team.name.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition">{team.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">Kuruluş: {team.foundationYear}</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">Güç: {team.strength}</span>
                    </div>
                    
                    {/* Renklerin Yazı ve Renkli Kareler İle İfadesi */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex -space-x-1 overflow-hidden">
                        {teamColors.map((hex, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-[140px]">{team.colors}</p>
                    </div>
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
            );
          })
        )}
      </div>
    </div>
  );
}