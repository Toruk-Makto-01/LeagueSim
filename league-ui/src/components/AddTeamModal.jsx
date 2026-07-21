import React, { useState } from 'react';

export default function AddTeamModal({ isOpen, onClose, onTeamAdded, existingTeams }) {
  const initialFormState = {
    name: '',
    colors: '',
    foundationYear: '',
    logoUrl: '',
    strength: 50,
    morale: 50
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errorMsg, setErrorMsg] = useState(''); // Hata mesajlarını göstermek için state

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'strength') {
      value = Math.min(100, Math.max(1, Number(value)));
    }

    setFormData({ ...formData, [name]: value });
    setErrorMsg(''); // Kullanıcı yazmaya başladığında eski hatayı temizle
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. KONTROL: Kuruluş yılı 4 basamaklı mı? (1000 ile 9999 arası)
    const year = parseInt(formData.foundationYear);
    if (year < 1000 || year > 9999 || formData.foundationYear.length !== 4) {
      setErrorMsg('Kuruluş yılı 4 basamaklı geçerli bir yıl olmalıdır (Örn: 1905).');
      return;
    }

    // 2. KONTROL: Aynı isimde takım var mı? (Büyük/küçük harf duyarsız kontrol)
    const nameExists = existingTeams.some(
      team => team.name.toLowerCase() === formData.name.trim().toLowerCase()
    );

    if (nameExists) {
      setErrorMsg(`"${formData.name}" adında bir takım zaten mevcut! Lütfen farklı bir isim girin.`);
      return;
    }

    // Her şey yolundaysa C# API'ye gönder
    fetch('https://localhost:7230/api/Team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        colors: formData.colors,
        foundationYear: year,
        logoUrl: formData.logoUrl || 'https://via.placeholder.com/60', // Boşsa varsayılan placeholder
        strength: parseInt(formData.strength),
        morale: parseInt(formData.morale)
      }),
    })
      .then(res => {
        if (res.ok) {
          onTeamAdded();
          handleClose();
        } else {
          setErrorMsg('Takım eklenirken sunucu tarafında bir hata oluştu.');
        }
      })
      .catch(err => {
        console.error('Hata:', err);
        setErrorMsg('Bağlantı hatası oluştu.');
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🛡️ Yeni Takım Ekle</h2>
        
        {/* Hata mesajı varsa kırmızı kutuda göster */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım Adı</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Trabzonspor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım Renkleri</label>
            <input 
              type="text" 
              name="colors" 
              required
              value={formData.colors} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Bordo-Mavi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kuruluş Yılı (4 Haneli)</label>
            <input 
              type="number" 
              name="foundationYear" 
              required
              min="1000"
              max="9999"
              value={formData.foundationYear} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: 1967"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Güç (1 - 100 Arası)</label>
            <input 
              type="number" 
              name="strength" 
              required
              min="1"
              max="100"
              value={formData.strength} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: 80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (İsteğe Bağlı)</label>
            <input 
              type="text" 
              name="logoUrl" 
              value={formData.logoUrl} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://... (Boş bırakılabilir)"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}