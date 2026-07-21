import React, { useState } from 'react';
import TeamsPage from './pages/TeamsPage';
import FixturePage from './pages/FixturePage';
import StandingsPage from './pages/StandingsPage'; // <--- İçe aktardık

export default function App() {
  const [activeMenu, setActiveMenu] = useState('teams');

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <div className="w-64 bg-slate-900 text-white p-6 shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-slate-700 pb-4">
          ⚽ Lig Simülasyonu
        </h2>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveMenu('teams')}
            className={`text-left px-4 py-3 rounded-lg transition ${activeMenu === 'teams' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            🛡️ Takımlar
          </button>
          
          <button 
            onClick={() => setActiveMenu('fixture')}
            className={`text-left px-4 py-3 rounded-lg transition ${activeMenu === 'fixture' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            📅 Fikstür & Simülasyon
          </button>
          
          <button 
            onClick={() => setActiveMenu('standings')}
            className={`text-left px-4 py-3 rounded-lg transition ${activeMenu === 'standings' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            🏆 Puan Durumu
          </button>
        </nav>
      </div>

      {/* SAĞ İÇERİK ALANI */}
      <div className="flex-1 overflow-auto">
        {activeMenu === 'teams' && <TeamsPage />}
        {activeMenu === 'fixture' && <FixturePage />}
        {activeMenu === 'standings' && <StandingsPage />} {/* <--- Bağlantıyı kurduk */}
      </div>

    </div>
  );
}