

# ⚽ Futbol Ligi Yönetim ve Simülasyon Sistemi (PoC)

Bu proje; katmanlı mimarı, CRUD işlemleri, ilişkisel veritabanı tasarımı, kural tabanlı iş mantığı (business logic) geliştirme ve lig simülasyon algoritmalarını öğrenmek amacıyla geliştirilmiş full-stack bir **Proof of Concept (PoC)** web uygulamasıdır.

Kullanıcılar takımları yönetebilir, otomatik olarak çift devreli lig fikstürü üretebilir, haftalık veya tüm sezon maçlarını simüle edebilir ve canlı puan durumunu takip edebilirler.

---

## 🚀 Öne Çıkan Özellikler

* **Takım Yönetimi (CRUD):** Takım ekleme, güncelleme, silme ve listeleme. Takımlara ait kuruluş yılı, ana renkler, logo, güç (`Strength`) ve moral (`Morale`) değerleri takibi.
* **Otomatik Fikstür Algoritması:** **Round-Robin (Döngüsel Eşleşme)** algoritması ile rövanşlı (çift devreli) lig fikstürü üretimi. Tekli takım sayılarında otomatik "BAY" takımı yönetimi.
* **Gelişmiş Maç Simülasyon Motoru:**
* **Takım Gücü ve Saha Avantajı:** Ev sahibi takıma $+0.5$ gol beklentisi (xG) avantajı.
* **Dinamik Moral Sistemi:** Galibiyette $+5$, mağlubiyette $-5$ moral değişimi.
* **Kartopu Etkisi Sınırlandırması:** `Math.Clamp(50, 150)` ile aşırı uç skorların ve dengesizliklerin engellenmesi.


* **Otomatik Puan Tablosu:** TFF / UEFA standartlarına uygun sıralama kuralı: **Puan > Averaj > Atılan Gol**.
* **Sezon Tamamlama & Şampiyonluk:** Tüm sezonu tek tıkla oynatma (`PlayAllSeason`) ve sezon sonunda konfeti animasyonlu Şampiyonluk Ekranı.

---

## 🛠️ Kullanılan Teknolojiler

### Backend

* **Dil & Framework:** C# / .NET 8.0 ASP.NET Core Web API
* **ORM:** Entity Framework Core 8.0
* **Veritabanı:** SQLite (Dosya tabanlı, taşınabilir DB)
* **Mimari Pattern:** Katmanlı Mimari (Controller -> Service -> Repository -> Entity/Model), Dependency Injection, CORS Yönetimi

### Frontend

* **Kütüphane & Araçlar:** React 18, Vite
* **Stil:** Tailwind CSS, Lucide React (İkon Seti)
* **HTTP İstemcisi:** Axios
* **Animasyon & Yönlendirme:** React Router DOM, Canvas-Confetti

---

## 📁 Proje Klasör Yapısı

```text
football-league-simulation/
├── FootballLeague.Api/                # Backend (C# .NET Core Web API)
│   ├── Controllers/                   # API Uç Noktaları (Team, Fixture, Simulation, Standing)
│   ├── Services/                      # İş Mantığı & Simülasyon Algoritmaları
│   ├── Repositories/                  # Veri Erişim Katmanı (Repository Pattern)
│   ├── Models/                        # Entity Sınıfları (Team, Week, Match, League)
│   ├── Data/                          # AppDbContext ve EF Core Migration Yapılandırması
│   ├── wwwroot/                       # Logo ve Statik Dosya Deposu
│   └── Program.cs                     # DI Kayıtları ve Pipeline Ayarları
│
└── football-league-ui/                # Frontend (React + Vite)
    ├── src/
    │   ├── components/                # Sidebar, Modal, Confetti vb. Bileşenler
    │   ├── pages/                     # Teams, Fixture, Standings Sayfaları
    │   ├── services/                  # Axios Central API İstemcisi
    │   └── App.jsx                    # Router ve Layout Kurgusu
    └── tailwind.config.js             # Tailwind CSS Yapılandırması

```

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz.

### Gereksinimler

* [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
* [Node.js (v18 veya üzeri)](https://nodejs.org/)
* Git

---

### 1. Backend (C# Web API) Çalıştırma

```bash
# Projeyi klonlayın
git clone https://github.com/kullaniciadi/football-league-simulation.git
cd football-league-simulation/FootballLeague.Api

# Bağımlılıkları yükleyin
dotnet restore

# Veritabanı göçlerini (migration) uygulayın
dotnet ef database update

# Backend sunucusunu başlatın
dotnet run

```

> ℹ️ Backend servisi varsayılan olarak `http://localhost:5000` (veya `https://localhost:7001`) portunda yayına başlayacaktır.
> Swagger UI arayüzüne `http://localhost:5000/swagger` adresinden erişebilirsiniz.

---

### 2. Frontend (React + Vite) Çalıştırma

Yeni bir terminal penceresi açın:

```bash
# Frontend dizinine geçin
cd football-league-simulation/football-league-ui

# Node paketlerini yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

```

> ℹ️ Frontend uygulaması varsayılan olarak `http://localhost:5173` adresinde çalışacaktır. Tarayıcınızdan bu adrese giderek uygulamayı kullanabilirsiniz.

---

## 🔍 API Uç Noktaları (Endpoints)

| Modül | HTTP Metodu | Uç Nokta | Açıklama |
| --- | --- | --- | --- |
| **Takım** | `GET` | `/api/teams` | Tüm takımları listeler. |
| **Takım** | `POST` | `/api/teams` | Yeni takım ekler. |
| **Takım** | `PUT` | `/api/teams/{id}` | Takım bilgilerini günceller. |
| **Takım** | `DELETE` | `/api/teams/{id}` | Takımı siler. |
| **Fikstür** | `POST` | `/api/fixture/generate` | Çift devreli 34 haftalık fikstürü üretir. |
| **Fikstür** | `GET` | `/api/fixture` | Haftalık maç programını getirir. |
| **Simülasyon** | `POST` | `/api/simulation/play-next-week` | Oynanmamış sonraki haftayı simüle eder. |
| **Simülasyon** | `POST` | `/api/simulation/play-all-season` | Tüm ligi tek seferde simüle eder. |
| **Puan Durumu** | `GET` | `/api/standings` | Anlık puan cetvelini sıralı getirir. |

---

## 👨‍💻 Lisans ve Bilgilendirme

Bu proje üniversite staj görevi kapsamında **Proof of Concept (PoC)** olarak geliştirilmiştir. Tüm hakları saklıdır.