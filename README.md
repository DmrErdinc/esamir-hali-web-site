# ESAMIR - Lüks Halı & İç Mimarlık

Modern, full-stack e-ticaret ve iç mimarlık danışmanlık platformu.

## 🚀 Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Veritabanı:** PostgreSQL + Prisma ORM
- **Stil:** Tailwind CSS
- **UI Bileşenleri:** Radix UI + shadcn/ui
- **Animasyon:** Framer Motion
- **Form Yönetimi:** React Hook Form + Zod
- **Kimlik Doğrulama:** JWT (jose)
- **Deployment:** Docker + Docker Compose

## 📋 Özellikler

### Public Site
- ✅ Responsive tasarım (mobil, tablet, desktop)
- ✅ SEO optimize edilmiş sayfalar
- ✅ Dinamik ürün ve kategori yönetimi
- ✅ Blog sistemi
- ✅ İç mimarlık hizmetleri sayfası
- ✅ Google Maps entegrasyonu
- ✅ WhatsApp entegrasyonu
- ✅ Google değerlendirme CTA
- ✅ Dinamik sitemap ve robots.txt

### Admin Panel
- ✅ Güvenli giriş sistemi
- ✅ Ürün yönetimi (CRUD)
- ✅ Kategori yönetimi (CRUD)
- ✅ Blog yönetimi (CRUD)
- ✅ Medya kütüphanesi
- ✅ Site ayarları yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Responsive admin arayüzü

## 🛠️ Kurulum

### Gereksinimler

- Node.js 20+
- PostgreSQL 16+
- npm veya yarn

### Yerel Geliştirme

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd esamir
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://esamir:esamir_pass@localhost:5432/esamir_db"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@esamir.com"
ADMIN_PASSWORD="Admin123!"
ADMIN_NAME="ESAMIR Admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. **Veritabanını hazırlayın:**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin

### Docker ile Kurulum

1. **Docker Compose ile başlatın:**
```bash
docker-compose up -d
```

2. **Migration ve seed çalıştırın:**
```bash
docker-compose --profile migrate run --rm migrate
```

3. **Siteye erişin:**
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## 📦 Production Deployment

### Docker ile Production

1. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env
```

`.env` dosyasını production değerleriyle güncelleyin.

2. **Build ve başlatın:**
```bash
docker-compose up -d
docker-compose --profile migrate run --rm migrate
```

### Manuel Deployment

1. **Build alın:**
```bash
npm run build
```

2. **Production sunucusunu başlatın:**
```bash
npm start
```

## 🗂️ Proje Yapısı

```
esamir/
├── prisma/
│   ├── schema.prisma      # Veritabanı şeması
│   ├── seed.ts            # Seed verisi
│   └── migrations/        # Migration dosyaları
├── public/
│   ├── images/            # Statik görseller
│   └── uploads/           # Yüklenen medya
├── src/
│   ├── actions/           # Server actions
│   ├── app/               # Next.js app router
│   │   ├── (public)/      # Public sayfalar
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API routes
│   ├── components/        # React bileşenleri
│   │   ├── admin/         # Admin bileşenleri
│   │   ├── home/          # Ana sayfa bileşenleri
│   │   ├── layout/        # Layout bileşenleri
│   │   ├── products/      # Ürün bileşenleri
│   │   ├── shared/        # Paylaşılan bileşenler
│   │   └── ui/            # UI bileşenleri
│   └── lib/               # Utility fonksiyonlar
├── .env.example           # Örnek ortam değişkenleri
├── docker-compose.yml     # Docker Compose yapılandırması
├── Dockerfile             # Production Dockerfile
├── Dockerfile.migrate     # Migration Dockerfile
└── package.json           # Proje bağımlılıkları
```

## 🔐 Varsayılan Admin Girişi

```
E-posta: admin@esamir.com
Şifre: Admin123!
```

**ÖNEMLİ:** Production'da mutlaka değiştirin!

## 📝 Komutlar

```bash
# Geliştirme
npm run dev              # Dev sunucusu
npm run build            # Production build
npm start                # Production sunucusu
npm run lint             # Linting

# Veritabanı
npm run db:generate      # Prisma client oluştur
npm run db:push          # Schema'yı DB'ye push et
npm run db:migrate       # Migration çalıştır
npm run db:migrate:dev   # Dev migration
npm run db:seed          # Seed verisi ekle
npm run db:studio        # Prisma Studio aç
```

## 🎨 Özelleştirme

### Site Ayarları

Admin panelden tüm site ayarlarını yönetebilirsiniz:
- Genel bilgiler (site adı, açıklama, logo)
- İletişim bilgileri
- Sosyal medya linkleri
- Google Maps ayarları
- Google değerlendirme ayarları
- SEO ayarları
- Header/Footer içerikleri
- Ana sayfa bölümleri
- Hakkımızda sayfası
- İç mimarlık sayfası

### Tema Renkleri

`tailwind.config.ts` dosyasından tema renklerini özelleştirebilirsiniz.

## 🐛 Sorun Giderme

### Database bağlantı hatası
```bash
# PostgreSQL'in çalıştığından emin olun
# DATABASE_URL'in doğru olduğunu kontrol edin
npm run db:push
```

### Build hatası
```bash
# node_modules ve .next'i temizleyin
rm -rf node_modules .next
npm install
npm run build
```

### Upload klasörü izin hatası
```bash
# Upload klasörüne yazma izni verin
chmod -R 755 public/uploads
```

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 🤝 Destek

Sorularınız için: info@esamir.com
