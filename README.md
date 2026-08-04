# 🏆 LeagueSim - Futbol Lig Simülasyonu

LeagueSim, takımların yönetildiği, otomatik fikstürlerin oluşturulduğu ve maç sonuçlarının dinamik olarak simüle edilerek puan durumunun hesaplandığı tam yığın (full-stack) bir web uygulamasıdır. 

## 🚀 Özellikler

- **Takım Yönetimi:** Lige yeni takımlar ekleme, güç ve moral değerlerini belirleme.
- **Dinamik Fikstür Üretimi:** Takım sayısına göre çift devreli (Rövanşlı) lig fikstürünü otomatik oluşturma.
- **Adil Simülasyon:** Her sezon veya yeni fikstür başlangıcında takımların moral değerlerinin sıfırlanması.
- **Maç Motoru:** Maçların oynanması, skorların belirlenmesi ve sonuçların kaydedilmesi.
- **Canlı Puan Durumu:** Oynanan maçlara göre (Puan > Averaj > Atılan Gol) sıralanan dinamik puan tablosu.
- **Şampiyonluk Kutlaması:** 34 haftalık tüm maçlar tamamlandığında lider takımın logosuyla birlikte şampiyon ilan edilmesi.

## 💻 Kullanılan Teknolojiler

**Frontend (Kullanıcı Arayüzü):**
- React.js
- Tailwind CSS (Modern ve duyarlı tasarım için)

**Backend (Sunucu ve API):**
- C# & .NET 8 (ASP.NET Core Web API)
- Entity Framework Core (ORM)
- Veritabanı: SQLite 

## 📸 Ekran Görüntüleri

*(Buraya projenin çalıştığı anlardan 2-3 ekran görüntüsü ekleyebilirsin)*
![Takımlar](1.png)
![Haftalar](2.png)
![Puan Durumu](3.png)

## 🛠️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

### 1. Backend (.NET API)
1. Terminali açın ve backend klasörüne gidin.
2. Gerekli paketleri yüklemek ve veritabanını oluşturmak için:
   ```bash
   dotnet restore
   dotnet ef database update

3. API'yi başlatın:
    ```bash
    dotnet run

### 2. Frontend (React)

1. Terminalde frontend (React) klasörüne gidin.
2. Bağımlılıkları yükleyin:
    ```bash
    npm install

3. Projeyi ayağa kaldırın:
    ```bash
    npm run dev

## 👨‍💻 Geliştirici

* **Hamza Erdal** 
