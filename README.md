# 🏛️ ESAMIR - Lüks Halı & İç Mimarlık E-Ticaret Platformu

<div align="center">

![ESAMIR Logo](https://via.placeholder.com/200x80/8B6F47/FFFFFF?text=ESAMIR)

**Modern, Full-Stack E-Ticaret ve İç Mimarlık Danışmanlık Platformu**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

[Demo](#-demo) • [Özellikler](#-özellikler) • [Kurulum](#️-kurulum) • [Deployment](#-deployment) • [Dokümantasyon](#-dokümantasyon)

</div>

---

## 📸 Ekran Görüntüleri

### 🌐 Public Site

<div align="center">

**Ana Sayfa**
![Ana Sayfa](screenshots/homepage.png)

**Ürün Detay**
![Ürün Detay](screenshots/product-detail.png)

**Kategoriler**
![Kategoriler](screenshots/categories.png)

</div>

### 🎛️ Admin Panel

<div align="center">

**Dashboard**
![Dashboard](screenshots/admin-dashboard.png)

**Ürün Yönetimi**
![Ürün Yönetimi](screenshots/admin-products.png)

**Medya Kütüphanesi**
![Medya Kütüphanesi](screenshots/admin-media.png)

</div>

---

## 🚀 Teknoloji Stack

### Frontend
- **Framework:** Next.js 14.2 (App Router, Server Components, Server Actions)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion
- **Carousel:** Embla Carousel
- **Forms:** React Hook Form + Zod Validation
- **State Management:** React Context API
- **Icons:** Lucide React

### Backend
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Authentication:** JWT (jose)
- **File Upload:** Next.js API Routes
- **Image Optimization:** Next.js Image Component

### DevOps
- **Containerization:** Docker + Docker Compose
- **Build:** Next.js Standalone Output
- **Deployment:** VPS/Cloud Ready
- **CI/CD:** GitHub Actions Ready

---

## ✨ Özellikler

### 🌐 Public Site

#### 🏠 Ana Sayfa
- ✅ Hero section with brand messaging
- ✅ Featured products carousel (Embla)
- ✅ Featured categories carousel
- ✅ Quality section
- ✅ Interior design services preview
- ✅ Blog preview
- ✅ Google review CTA
- ✅ WhatsApp floating button
- ✅ Contact section with map

#### 🛍️ E-Ticaret
- ✅ Product listing with filters
- ✅ Product detail with gallery
- ✅ Drag & drop image reordering
- ✅ Category hierarchy (parent/child)
- ✅ Product search and filtering
- ✅ Price display toggle
- ✅ Stock status
- ✅ Product badges (New, Featured)
- ✅ E-commerce platform links (Trendyol, Hepsiburada, Shopier)
- ✅ WhatsApp product inquiry
- ✅ Related products

#### 📝 Blog
- ✅ Blog listing with categories
- ✅ Blog post detail
- ✅ Featured posts
- ✅ Read time calculation
- ✅ Author information
- ✅ SEO optimized

#### 📄 Sayfalar
- ✅ Hakkımızda (About)
- ✅ İç Mimarlık Hizmetleri (Interior Design)
- ✅ İletişim (Contact) with Google Maps
- ✅ SSS (FAQ)
- ✅ Gizlilik Politikası (Privacy Policy)
- ✅ Çerez Politikası (Cookie Policy)
- ✅ KVKK (GDPR)
- ✅ Custom 404 page

#### 🔍 SEO & Performance
- ✅ Dynamic sitemap.xml
- ✅ Dynamic robots.txt
- ✅ Meta tags (title, description, OG, Twitter)
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD)
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Server-side rendering

#### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop layouts
- ✅ Touch-friendly interactions
- ✅ Hamburger menu
- ✅ Mobile drawer navigation

### 🎛️ Admin Panel

#### 🔐 Authentication
- ✅ Secure JWT-based login
- ✅ Session management
- ✅ Role-based access (Super Admin, Admin, Editor)
- ✅ Password hashing (bcrypt)

#### 📊 Dashboard
- ✅ Statistics overview
- ✅ Quick actions
- ✅ Recent activity
- ✅ Responsive layout

#### 🛍️ Ürün Yönetimi
- ✅ Full CRUD operations
- ✅ Drag & drop image sorting
- ✅ Multiple image upload
- ✅ Cover image selection
- ✅ Category assignment
- ✅ Price management
- ✅ Stock management
- ✅ SEO fields
- ✅ Technical specifications (JSON)
- ✅ E-commerce platform links
- ✅ Bulk operations
- ✅ Status toggles (Active, Featured, New)

#### 📁 Kategori Yönetimi
- ✅ Parent/child hierarchy
- ✅ Cover and banner images
- ✅ SEO optimization
- ✅ Order management
- ✅ Promotional text

#### 📝 Blog Yönetimi
- ✅ Rich text editor
- ✅ Category management
- ✅ Featured posts
- ✅ Publish/draft status
- ✅ Read time calculation
- ✅ Author assignment
- ✅ SEO fields

#### 🖼️ Medya Kütüphanesi
- ✅ File upload (drag & drop)
- ✅ Image preview
- ✅ Folder organization
- ✅ Search and filter
- ✅ Bulk delete
- ✅ Image metadata

#### ⚙️ Site Ayarları
- ✅ General settings (site name, description, logo)
- ✅ Contact information (phone, email, address)
- ✅ Social media links
- ✅ WhatsApp integration
- ✅ Google Maps settings
- ✅ Google Review settings
- ✅ E-commerce platform links
- ✅ SEO defaults
- ✅ Header/Footer content
- ✅ Homepage sections
- ✅ About page content
- ✅ Interior design page content

#### 📄 İçerik Blokları
- ✅ Dynamic content blocks
- ✅ Reusable components
- ✅ Order management
- ✅ Active/inactive toggle

#### 👥 Kullanıcı Yönetimi
- ✅ User CRUD
- ✅ Role assignment
- ✅ Active/inactive status
- ✅ Avatar upload

#### 🎨 UI/UX
- ✅ Modern dark sidebar
- ✅ Collapsible sidebar
- ✅ Mobile drawer
- ✅ Breadcrumbs
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling
- ✅ Confirmation dialogs

---

## 🛠️ Kurulum

### Gereksinimler

- **Node.js:** 20.x veya üzeri
- **PostgreSQL:** 16.x veya üzeri
- **npm/yarn:** En son sürüm
- **Docker:** (Opsiyonel) 24.x veya üzeri

### 📦 Yerel Geliştirme

#### 1. Projeyi Klonlayın

```bash
git clone https://github.com/DmrErdinc/esamir-hal--web-site.git
cd esamir
```

#### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

#### 3. Ortam Değişkenlerini Ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# Database
DATABASE_URL="postgresql://esamir:esamir_pass@localhost:5432/esamir_db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Admin User (Seed için)
ADMIN_EMAIL="admin@esamir.com"
ADMIN_PASSWORD="Admin123!"
ADMIN_NAME="ESAMIR Admin"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

#### 4. Veritabanını Hazırlayın

```bash
# Prisma client oluştur
npm run db:generate

# Schema'yı veritabanına push et
npm run db:push

# Seed verilerini ekle (admin user, örnek kategoriler, ürünler)
npm run db:seed
```

#### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

🎉 **Hazır!**
- **Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Admin Giriş:** admin@esamir.com / Admin123!

---

### 🐳 Docker ile Kurulum

#### 1. Docker Compose ile Başlatın

```bash
# Servisleri başlat
docker-compose up -d

# Migration ve seed çalıştır
docker-compose --profile migrate run --rm migrate
```

#### 2. Siteye Erişin

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Database:** localhost:5432

#### 3. Logları İzleyin

```bash
docker-compose logs -f app
```

#### 4. Durdurma ve Temizleme

```bash
# Durdur
docker-compose down

# Volumeleri de sil
docker-compose down -v
```

---

## 🚀 Deployment

### 🐳 Docker ile Production

#### 1. Ortam Değişkenlerini Ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını production değerleriyle güncelleyin:

```env
DATABASE_URL="postgresql://user:pass@db:5432/esamir_prod"
NEXTAUTH_SECRET="production-secret-key-very-long-and-secure"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

#### 2. Build ve Başlatın

```bash
# Production build
docker-compose up -d

# Migration çalıştır
docker-compose --profile migrate run --rm migrate
```

#### 3. SSL/HTTPS Ayarlayın

Nginx veya Traefik ile reverse proxy kullanın:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 📦 Manuel Deployment (VPS)

#### 1. Sunucuya Bağlanın

```bash
ssh user@your-server-ip
```

#### 2. Gerekli Yazılımları Yükleyin

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 16
sudo apt-get install -y postgresql-16

# PM2 (Process Manager)
sudo npm install -g pm2
```

#### 3. Projeyi Klonlayın ve Kurun

```bash
git clone <your-repo-url>
cd esamir
npm install
```

#### 4. Build Alın

```bash
npm run build
```

#### 5. PM2 ile Başlatın

```bash
pm2 start npm --name "esamir" -- start
pm2 save
pm2 startup
```

#### 6. Nginx Yapılandırması

```bash
sudo nano /etc/nginx/sites-available/esamir
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/esamir /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📁 Proje Yapısı

```
esamir/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Seed data
│   └── migrations/                # Database migrations
├── public/
│   ├── images/                    # Static images
│   └── uploads/                   # User uploaded media
├── src/
│   ├── actions/                   # Server actions
│   │   ├── auth.ts               # Authentication
│   │   ├── products.ts           # Product CRUD
│   │   ├── categories.ts         # Category CRUD
│   │   ├── blog.ts               # Blog CRUD
│   │   ├── settings.ts           # Settings management
│   │   └── users.ts              # User management
│   ├── app/
│   │   ├── (public)/             # Public pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── urunler/          # Products
│   │   │   ├── kategoriler/      # Categories
│   │   │   ├── blog/             # Blog
│   │   │   ├── hakkimizda/       # About
│   │   │   ├── ic-mimarlik/      # Interior design
│   │   │   ├── iletisim/         # Contact
│   │   │   └── sss/              # FAQ
│   │   ├── admin/                # Admin panel
│   │   │   ├── (panel)/          # Dashboard & settings
│   │   │   ├── urunler/          # Product management
│   │   │   ├── kategoriler/      # Category management
│   │   │   ├── blog/             # Blog management
│   │   │   ├── medya/            # Media library
│   │   │   ├── kullanicilar/     # User management
│   │   │   └── login/            # Admin login
│   │   ├── api/                  # API routes
│   │   │   ├── upload/           # File upload
│   │   │   └── media/            # Media operations
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── robots.ts             # Dynamic robots.txt
│   │   └── sitemap.ts            # Dynamic sitemap.xml
│   ├── components/
│   │   ├── admin/                # Admin components
│   │   │   ├── AdminShell.tsx    # Admin layout
│   │   │   ├── AdminSidebar.tsx  # Sidebar navigation
│   │   │   ├── ProductForm.tsx   # Product form
│   │   │   ├── CategoryForm.tsx  # Category form
│   │   │   ├── BlogPostForm.tsx  # Blog form
│   │   │   ├── MediaManager.tsx  # Media library
│   │   │   └── SettingsForm.tsx  # Settings form
│   │   ├── home/                 # Homepage components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── FeaturedCategories.tsx
│   │   │   └── GoogleReviewCTA.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   ├── products/             # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductGallery.tsx
│   │   ├── shared/               # Shared components
│   │   │   └── Breadcrumb.tsx
│   │   └── ui/                   # UI components (shadcn)
│   ├── lib/
│   │   ├── auth.ts               # Auth utilities
│   │   ├── prisma.ts             # Prisma client
│   │   ├── settings.ts           # Settings utilities
│   │   ├── utils.ts              # Helper functions
│   │   └── validations.ts        # Zod schemas
│   └── middleware.ts             # Next.js middleware
├── .env.example                  # Environment variables template
├── .eslintrc.json               # ESLint config
├── docker-compose.yml           # Docker Compose config
├── Dockerfile                   # Production Dockerfile
├── Dockerfile.migrate           # Migration Dockerfile
├── next.config.mjs              # Next.js config
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind config
└── tsconfig.json                # TypeScript config
```

---

## 🔐 Güvenlik

### Varsayılan Admin Girişi

```
E-posta: admin@esamir.com
Şifre: Admin123!
```

⚠️ **ÖNEMLİ:** Production'da mutlaka değiştirin!

### Güvenlik Önlemleri

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ Rate limiting (önerilir)
- ✅ HTTPS enforcement (production)
- ✅ Environment variables
- ✅ Secure headers

---

## 📝 Komutlar

### Development

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
```

### Database

```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:migrate:dev   # Create and run dev migration
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database (⚠️ deletes all data)
```

### Docker

```bash
docker-compose up -d                              # Start services
docker-compose down                               # Stop services
docker-compose logs -f app                        # View logs
docker-compose --profile migrate run --rm migrate # Run migrations
docker-compose exec app npm run db:seed           # Seed database
```

---

## 🎨 Özelleştirme

### Site Ayarları

Admin panelden (`/admin/ayarlar`) tüm site ayarlarını yönetebilirsiniz:

#### Genel
- Site adı, açıklama, logo, favicon
- İletişim bilgileri (telefon, WhatsApp, e-posta, adres)
- Çalışma saatleri
- Sosyal medya linkleri

#### Google Entegrasyonları
- Google Maps (embed, URL, lat/lng)
- Google Review (link, başlık, açıklama, buton metni)
- Görünürlük ayarları

#### E-Ticaret Platformları
- Trendyol mağaza linki
- Hepsiburada mağaza linki
- Shopier mağaza linki
- Footer görünürlük

#### SEO
- Varsayılan title ve description
- Meta tags
- Open Graph ayarları

#### İçerik
- Header menü
- Footer içeriği
- Ana sayfa bölümleri
- Hakkımızda sayfası
- İç mimarlık sayfası

### Tema Renkleri

`tailwind.config.ts` dosyasından tema renklerini özelleştirebilirsiniz:

```typescript
colors: {
  brand: {
    50: '#FAF8F3',
    100: '#F5F0E8',
    // ... diğer tonlar
    900: '#3D2F1F',
  },
  gold: {
    DEFAULT: '#D4A574',
    light: '#E8C9A0',
    dark: '#B8935F',
  },
  cream: {
    50: '#FDFCFA',
    100: '#F8F3EB',
    // ... diğer tonlar
  },
}
```

### Font Değiştirme

`src/app/layout.tsx` dosyasından fontları değiştirebilirsiniz:

```typescript
import { Playfair_Display, Inter } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'] });
const sans = Inter({ subsets: ['latin'] });
```

---

## 🐛 Sorun Giderme

### Database Bağlantı Hatası

```bash
# PostgreSQL'in çalıştığından emin olun
sudo systemctl status postgresql

# DATABASE_URL'in doğru olduğunu kontrol edin
echo $DATABASE_URL

# Schema'yı push edin
npm run db:push
```

### Build Hatası

```bash
# Cache'i temizleyin
rm -rf .next node_modules
npm install
npm run build
```

### Upload Klasörü İzin Hatası

```bash
# Upload klasörüne yazma izni verin
chmod -R 755 public/uploads

# Docker'da
docker-compose exec app chmod -R 755 public/uploads
```

### Port Zaten Kullanımda

```bash
# 3000 portunu kullanan process'i bulun
lsof -i :3000

# Process'i sonlandırın
kill -9 <PID>
```

### Prisma Client Hatası

```bash
# Prisma client'ı yeniden oluşturun
npm run db:generate

# node_modules'ü temizleyin
rm -rf node_modules
npm install
```

### Docker Volume Sorunları

```bash
# Volumeleri temizleyin
docker-compose down -v

# Yeniden başlatın
docker-compose up -d
```

---

## 📚 Dokümantasyon

### API Endpoints

#### Upload
- `POST /api/upload` - Dosya yükleme
- `DELETE /api/media` - Medya silme

### Server Actions

#### Products
- `createProduct(data)` - Ürün oluştur
- `updateProduct(id, data)` - Ürün güncelle
- `deleteProduct(id)` - Ürün sil
- `toggleProductActive(id, isActive)` - Aktif/pasif
- `toggleProductFeatured(id, isFeatured)` - Öne çıkan

#### Categories
- `createCategory(data)` - Kategori oluştur
- `updateCategory(id, data)` - Kategori güncelle
- `deleteCategory(id)` - Kategori sil

#### Blog
- `createBlogPost(data)` - Blog yazısı oluştur
- `updateBlogPost(id, data)` - Blog yazısı güncelle
- `deleteBlogPost(id)` - Blog yazısı sil

#### Settings
- `updateSettings(data)` - Ayarları güncelle
- `getSettings()` - Ayarları getir

### Database Schema

Detaylı schema için `prisma/schema.prisma` dosyasına bakın.

Ana modeller:
- `User` - Kullanıcılar
- `Product` - Ürünler
- `ProductImage` - Ürün görselleri
- `Category` - Kategoriler
- `BlogPost` - Blog yazıları
- `BlogCategory` - Blog kategorileri
- `SiteSetting` - Site ayarları
- `MediaAsset` - Medya varlıkları
- `Page` - Sayfalar
- `ContentBlock` - İçerik blokları
- `MenuItem` - Menü öğeleri

---

## 🤝 Katkıda Bulunma

Bu proje özel bir projedir. Katkıda bulunmak için lütfen iletişime geçin.

---

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

© 2024 ESAMIR. All rights reserved.

---

## 📞 İletişim ve Destek

### Teknik Destek
- **E-posta:** eraydemir300@gmail.com
- **GitHub:** [Issues](https://github.com/DmrErdinc/esamir-hal--web-site)
- **Teşefon:**05527189160

### Sosyal Medya
- **Website:**
- **Instagram:** 
- **Facebook:**

---

## 🙏 Teşekkürler

Bu proje aşağıdaki harika açık kaynak projeler kullanılarak geliştirilmiştir:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Embla Carousel](https://www.embla-carousel.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ for ErdinçDemir**

[⬆ Başa Dön](#️-esamir---lüks-halı--iç-mimarlık-e-ticaret-platformu)

</div>
