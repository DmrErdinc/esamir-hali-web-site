import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@esamir.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@esamir.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Site settings
  const settings = [
    { key: "site_name", value: "ESAMIR" },
    { key: "site_description", value: "Premium İran Halısı & Aksesuar | İç Mimarlık Danışmanlığı" },
    { key: "phone", value: "+90 212 000 00 00" },
    { key: "whatsapp", value: "+905000000000" },
    { key: "email", value: "info@esamir.com" },
    { key: "address", value: "Örnek Mahallesi, Örnek Caddesi No:1\nİstanbul, Türkiye" },
    { key: "working_hours", value: "Pazartesi – Cumartesi: 09:00 – 19:00\nPazar: 11:00 – 18:00" },
    { key: "instagram", value: "https://instagram.com/esamir" },
    { key: "facebook", value: "" },
    { key: "pinterest", value: "" },
    { key: "youtube", value: "" },
    
    // E-commerce platforms
    { key: "ecommerce_trendyol_url", value: "" },
    { key: "ecommerce_hepsiburada_url", value: "" },
    { key: "ecommerce_shopier_url", value: "" },
    { key: "ecommerce_show_in_footer", value: "true" },
    
    { key: "google_review_show", value: "true" },
    { key: "google_review_title", value: "Deneyiminizi Paylaşın" },
    { key: "google_review_description", value: "Google yorumlarınız bizim için çok değerli." },
    { key: "google_review_button", value: "Değerlendirme Yap" },
    { key: "google_review_link", value: "https://g.page/r/esamir/review" },
    { key: "map_title", value: "Showroom Konumumuz" },
    { key: "map_width", value: "800px" },
    { key: "map_height", value: "600px" },
    
    // Admin Settings
    { key: "admin_username", value: "admin" },
    { key: "admin_password", value: "" }, // Boş bırakılır, değiştirilmek istendiğinde doldurulur
    
    // Appearance Settings
    { key: "font_family", value: "Inter" },
    
    // Header
    { key: "header_announcement_active", value: "false" },
    { key: "header_announcement", value: "Ücretsiz kargo kampanyamız devam ediyor! 🎉" },
    { key: "header_cta_label", value: "Koleksiyonu İncele" },
    { key: "header_cta_href", value: "/kategoriler" },
    
    // About Page
    { key: "about_hero_overline", value: "Hikayemiz" },
    { key: "about_hero_title", value: "Hakkımızda" },
    { key: "about_hero_bg", value: "/images/about-bg.jpg" },
    
    { key: "about_story_overline", value: "ESAMIR" },
    { key: "about_story_title", value: "Zarafeti Yaşam Alanlarına Taşıyoruz" },
    { key: "about_story_text1", value: "ESAMIR, İran'ın köklü halı dokuma geleneğine derin saygı duyarak kurulmuş, premium yaşam alanı çözümleri sunan bir markadır. 20 yılı aşkın deneyimimizle, her evin ve her mekanın ruhuna uygun özgün koleksiyonlar sunmaktayız." },
    { key: "about_story_text2", value: "Adımız Farsça'da \"güvenli, huzurlu\" anlamına gelen ESAMIR, bu ismin özüne sadık kalarak müşterilerimize yalnızca ürün değil; güven, estetik ve kalıcı değer sunmayı hedefler." },
    { key: "about_story_text3", value: "Her halı bir sanat eseridir; her aksesuar bir hikaye anlatır. Biz bu hikayeleri sizin evinizde yaşatmak için buradayız." },
    { key: "about_story_image", value: "/images/about-story.jpg" },
    
    { key: "about_philosophy_overline", value: "İç Mimarlık Felsefemiz" },
    { key: "about_philosophy_title", value: "Mekan, Anlam Kazanır" },
    { key: "about_philosophy_desc", value: "İç mimarlık yaklaşımımız, mekânın yalnızca fiziksel boyutunu değil, duygusal ve estetik katmanlarını da göz önünde bulundurur." },
    { key: "about_philosophy_item1_title", value: "Kişiselleştirilmiş Tasarım" },
    { key: "about_philosophy_item1_desc", value: "Her müşterimizin yaşam tarzı, beğeni ve ihtiyaçlarına özgü çözümler geliştiriyoruz." },
    { key: "about_philosophy_item1_num", value: "01" },
    { key: "about_philosophy_item2_title", value: "Kalıcı Estetik" },
    { key: "about_philosophy_item2_desc", value: "Moda değil; zamansız, kalıcı ve değer katan estetik seçimler yapıyoruz." },
    { key: "about_philosophy_item2_num", value: "02" },
    { key: "about_philosophy_item3_title", value: "Kusursuz Harmoni" },
    { key: "about_philosophy_item3_desc", value: "Halı, aksesuar ve mobilya arasındaki dengeyi titizlikle kurarak bütünlük yaratıyoruz." },
    { key: "about_philosophy_item3_num", value: "03" },
    
    { key: "about_heritage_overline", value: "İran Halısı Geleneği" },
    { key: "about_heritage_title", value: "Asırların Birikimiyle Dokunan Sanat" },
    { key: "about_heritage_text1", value: "İran halısı, binlerce yıllık bir dokuma geleneğinin ve kültürel zenginliğin ürünüdür. Her halı; rengiyle, deseniyle ve malzeme kalitesiyle bir medeniyetin izlerini taşır." },
    { key: "about_heritage_text2", value: "Koleksiyonumuzdaki her parça, İran'ın farklı bölgelerindeki usta ellerden çıkmıştır. İpek, yün ve özel karışım ipliklerle dokunan bu halılar; hem dekoratif hem de uzun ömürlü yatırım değeri taşır." },
    { key: "about_heritage_img1", value: "/images/carpet-1.jpg" },
    { key: "about_heritage_img2", value: "/images/carpet-2.jpg" },
    
    { key: "about_stat1_number", value: "500+" },
    { key: "about_stat1_label", value: "Tamamlanan Proje" },
    { key: "about_stat2_number", value: "20+" },
    { key: "about_stat2_label", value: "Yıllık Deneyim" },
    { key: "about_stat3_number", value: "1000+" },
    { key: "about_stat3_label", value: "Ürün Çeşidi" },
    { key: "about_stat4_number", value: "98%" },
    { key: "about_stat4_label", value: "Müşteri Memnuniyeti" },
    
    { key: "about_cta_title", value: "Birlikte Yaratın" },
    { key: "about_cta_desc", value: "Projeniz için ücretsiz danışmanlık ve showroom ziyareti için iletişime geçin." },
    { key: "about_cta_primary_label", value: "İletişime Geçin" },
    { key: "about_cta_primary_href", value: "/iletisim" },
    { key: "about_cta_secondary_label", value: "Koleksiyonu İncele" },
    { key: "about_cta_secondary_href", value: "/kategoriler" },
    
    // Hero Section
    { key: "hero_subtitle", value: "Premium Koleksiyon" },
    { key: "hero_title", value: "Yaşam Alanlarına Zarafet Katın" },
    { key: "hero_description", value: "Seçkin İran halısı koleksiyonu, premium aksesuarlar ve profesyonel iç mimarlık danışmanlığı ile yaşam alanlarınızı baştan tasarlıyoruz." },
    { key: "hero_cta_label", value: "Koleksiyonu Keşfet" },
    { key: "hero_cta_href", value: "/kategoriler" },
    { key: "hero_image", value: "/images/hero-bg.jpg" },
    
    // Interior Design Page
    { key: "interior_page_hero_overline", value: "Hizmetlerimiz" },
    { key: "interior_page_hero_title", value: "İç Mimarlık &" },
    { key: "interior_page_hero_title_italic", value: "Tasarım Danışmanlığı" },
    { key: "interior_page_hero_desc", value: "Yaşam alanlarınızı sizin için tasarlıyor, halı ve aksesuar seçimlerinden uygulama sürecine kadar yanınızda oluyoruz." },
    { key: "interior_page_hero_bg", value: "/images/interior-hero.jpg" },
    
    { key: "interior_page_approach_overline", value: "Yaklaşımımız" },
    { key: "interior_page_approach_title", value: "Her Mekan Bir Kimlik Taşır" },
    { key: "interior_page_approach_text1", value: "İç mimarlık yaklaşımımız trendlere değil, zamansız estetiğe dayanır. Bir mekanı tasarlarken önce o mekanın \"ruhunu\" dinleriz; ardından halı, aksesuar ve renk seçimlerini bu ruha uygun şekilde kurgularız." },
    { key: "interior_page_approach_text2", value: "Oryantal desenin modernlikle buluştuğu noktalarda çalışmayı seviyoruz. İran halısının zengin mirası, çağdaş iç mimari anlayışıyla harmanlayarak mekanları hem köklenmiş hem de taze hissettiriyoruz." },
    { key: "interior_page_approach_features", value: "Kişiye özel tasarım konsepti\nÜcretsiz ilk danışmanlık görüşmesi\n3D görselleştirme imkânı\nYerinde uygulama desteği" },
    { key: "interior_page_approach_cta", value: "Danışmanlık Talep Et" },
    { key: "interior_page_approach_cta_url", value: "/iletisim" },
    { key: "interior_page_approach_img1", value: "/images/interior-1.jpg" },
    { key: "interior_page_approach_img2", value: "/images/interior-2.jpg" },
    
    { key: "interior_page_services_overline", value: "Neler Yapıyoruz" },
    { key: "interior_page_services_title", value: "Hizmetlerimiz" },
    { key: "interior_page_service1_title", value: "Konsept Tasarım" },
    { key: "interior_page_service1_desc", value: "Yaşam alanınızın ruhunu keşfeder, size özel bir tasarım konsepti geliştiririz." },
    { key: "interior_page_service1_icon", value: "01" },
    { key: "interior_page_service2_title", value: "Halı & Zemin Seçimi" },
    { key: "interior_page_service2_desc", value: "Mekanın boyutları, ışığı ve renk paleti doğrultusunda en uygun halı ve zemin kaplamasını birlikte seçeriz." },
    { key: "interior_page_service2_icon", value: "02" },
    { key: "interior_page_service3_title", value: "Aksesuar Koordinasyonu" },
    { key: "interior_page_service3_desc", value: "Kırlent, vazo, biblo ve dekoratif objelerle mekânın bütünlüğünü tamamlarız." },
    { key: "interior_page_service3_icon", value: "03" },
    { key: "interior_page_service4_title", value: "Renk & Doku Danışmanlığı" },
    { key: "interior_page_service4_desc", value: "Renk paletleri ve doku kombinasyonlarıyla mekanınıza derinlik ve karakter katarız." },
    { key: "interior_page_service4_icon", value: "04" },
    { key: "interior_page_service5_title", value: "3D Görselleştirme" },
    { key: "interior_page_service5_desc", value: "Nihai tasarımı uygulamadan önce 3D görsellerle projenizi somutlaştırıyoruz." },
    { key: "interior_page_service5_icon", value: "05" },
    { key: "interior_page_service6_title", value: "Uygulama & Teslimat" },
    { key: "interior_page_service6_desc", value: "Seçilen ürünlerin temin edilmesi ve yerleştirilmesi sürecinde yanınızdayız." },
    { key: "interior_page_service6_icon", value: "06" },
    
    { key: "interior_page_process_overline", value: "Nasıl Çalışırız" },
    { key: "interior_page_process_title", value: "Süreç" },
    { key: "interior_page_step1_title", value: "İlk Görüşme" },
    { key: "interior_page_step1_desc", value: "Beklentilerinizi ve mekan ihtiyaçlarınızı dinliyoruz." },
    { key: "interior_page_step2_title", value: "Mekan Analizi" },
    { key: "interior_page_step2_desc", value: "Alanı ölçüyor, ışık, renk ve doku analizini yapıyoruz." },
    { key: "interior_page_step3_title", value: "Konsept Sunumu" },
    { key: "interior_page_step3_desc", value: "Size özel tasarım konseptini sunuyoruz." },
    { key: "interior_page_step4_title", value: "Ürün Seçimi" },
    { key: "interior_page_step4_desc", value: "Koleksiyonumuzdan sizin için en uygun parçaları öneriyoruz." },
    { key: "interior_page_step5_title", value: "Uygulama" },
    { key: "interior_page_step5_desc", value: "Onaylanan tasarımı hayata geçiriyoruz." },
    
    { key: "interior_page_cta_title", value: "Projenizi Konuşalım" },
    { key: "interior_page_cta_desc", value: "Ücretsiz danışmanlık görüşmesi için bizimle iletişime geçin." },
    { key: "interior_page_cta_button", value: "İletişime Geçin" },
    { key: "interior_page_cta_url", value: "/iletisim" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log("✅ Site settings seeded");

  // Categories
  const categories = [
    {
      name: "İran Halısı",
      slug: "iran-halisi",
      description: "El dokuması otantik İran halıları",
      isFeatured: true,
      order: 1,
      children: [
        { name: "İpek Halı", slug: "ipek-hali", description: "Saf ipek el dokuması halılar", order: 1 },
        { name: "Yün Halı", slug: "yun-hali", description: "Doğal yün el dokuması halılar", order: 2 },
        { name: "Bamboo İpek", slug: "bamboo-ipek", description: "Bamboo ipek halılar", order: 3 },
      ],
    },
    {
      name: "Akrilik Halı",
      slug: "akrilik-hali",
      description: "Premium akrilik koleksiyon halılar",
      isFeatured: true,
      order: 2,
      children: [
        { name: "Saçaklı Akrilik", slug: "sacakli-akrilik", description: "Saçaklı akrilik halılar", order: 1 },
        { name: "Modern Akrilik", slug: "modern-akrilik", description: "Modern desenli akrilik halılar", order: 2 },
      ],
    },
    {
      name: "Aksesuar",
      slug: "aksesuar",
      description: "Dekoratif ev aksesuarları",
      isFeatured: true,
      order: 3,
      children: [
        { name: "Kırlent", slug: "kirlent", description: "Dekoratif kırlentler", order: 1 },
        { name: "Vazo", slug: "vazo", description: "El yapımı dekoratif vazolar", order: 2 },
        { name: "Biblo", slug: "biblo", description: "Dekoratif biblo ve objeler", order: 3 },
        { name: "Mumluk", slug: "mumluk", description: "Dekoratif mumluklar", order: 4 },
      ],
    },
    {
      name: "Puf & Sehpa",
      slug: "puf-sehpa",
      description: "Dekoratif puf ve sehpalar",
      isFeatured: false,
      order: 4,
      children: [],
    },
  ];

  for (const cat of categories) {
    const { children, ...catData } = cat;
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { ...catData, isActive: true },
      create: { ...catData, isActive: true },
    });

    for (const child of children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { ...child, parentId: parent.id, isActive: true },
        create: { ...child, parentId: parent.id, isActive: true },
      });
    }
  }
  console.log("✅ Categories seeded");

  // Sample products
  const ipekHali = await prisma.category.findUnique({ where: { slug: "ipek-hali" } });
  const yunHali = await prisma.category.findUnique({ where: { slug: "yun-hali" } });
  const kirlent = await prisma.category.findUnique({ where: { slug: "kirlent" } });

  const sampleProducts = [
    {
      name: "Isfahan İpek Halı",
      slug: "isfahan-ipek-hali",
      shortDesc: "Isfahan ustalığıyla dokunmuş saf ipek halı",
      description: "İran'ın Isfahan şehrinden gelen bu benzersiz ipek halı, 160.000 düğüm/m² yoğunluğuyla işlenmiştir. Çiçek motifleri ve merkez madalyon tasarımıyla klasik Isfahan estetiğini yansıtır.",
      material: "Saf İpek",
      dimensions: "200x300 cm",
      color: "Lacivert, Krem",
      sku: "ESM-IPK-001",
      price: 125000,
      showPrice: true,
      categoryId: ipekHali?.id,
      isFeatured: true,
      isNew: true,
      isActive: true,
      inStock: true,
    },
    {
      name: "Tabriz Yün Halı",
      slug: "tabriz-yun-hali",
      shortDesc: "Tabriz geleneğiyle el dokuması yün halı",
      description: "Tabriz'in köklü dokuma geleneğinden ilham alan bu yün halı, doğal boyalarla elde edilmiş zengin renkleriyle öne çıkar.",
      material: "Doğal Yün",
      dimensions: "160x230 cm",
      color: "Kırmızı, Lacivert, Krem",
      sku: "ESM-YUN-001",
      price: 45000,
      showPrice: true,
      categoryId: yunHali?.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
      inStock: true,
    },
    {
      name: "Isfahan Kırlent Seti",
      slug: "isfahan-kirlent-seti",
      shortDesc: "El nakışlı İran deseni kırlent seti (2'li)",
      description: "Isfahan halılarından ilham alan nakış desenleriyle bezeli bu kırlent seti, yaşam alanlarınıza özgünlük katar.",
      material: "Kadife, İpek Nakış",
      dimensions: "45x45 cm (2 adet)",
      color: "Lacivert, Altın",
      sku: "ESM-KRL-001",
      price: 3500,
      showPrice: true,
      categoryId: kirlent?.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
      inStock: true,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log("✅ Sample products seeded");

  // Blog categories
  const blogCats = [
    { name: "Halı Bakımı", slug: "hali-bakimi" },
    { name: "İç Mimarlık", slug: "ic-mimarlik" },
    { name: "Oryantal Dekor", slug: "oryantal-dekor" },
    { name: "Koleksiyon", slug: "koleksiyon" },
  ];

  for (const bc of blogCats) {
    await prisma.blogCategory.upsert({
      where: { slug: bc.slug },
      update: bc,
      create: bc,
    });
  }

  // Sample blog posts
  const bakimCat = await prisma.blogCategory.findUnique({ where: { slug: "hali-bakimi" } });

  await prisma.blogPost.upsert({
    where: { slug: "iran-halisi-nasil-temizlenir" },
    update: {},
    create: {
      title: "İran Halısı Nasıl Temizlenir?",
      slug: "iran-halisi-nasil-temizlenir",
      excerpt: "El dokuması İran halılarının ömrünü uzatmak için doğru bakım ve temizlik yöntemleri hakkında kapsamlı rehber.",
      content: `El dokuması İran halıları, yüzyıllarca sürebilecek kadar dayanıklıdır — ancak doğru bakım şarttır.

GÜNLÜK BAKIM

Hafif bir elektrikli süpürge ile düzenli temizlik yapın. Saçak kısımlarını emerken dikkatli olun, tüylenmeye yol açabilir. Halınızı haftada bir kez döndürerek eşit aşınma sağlayın.

LEKE TEMİZLİĞİ

Leke oluştuğunda hemen müdahale edin. Soğuk su ve az miktarda nötr sabun kullanın. Ovalamak yerine bastırarak temizleyin; ovalamak lifi zedeleyebilir. Sıcak su kullanmayın.

PROFESYONEL TEMİZLİK

Yılda bir kez profesyonel halı yıkama hizmetinden yararlanmanızı öneririz. Ev tipi makineler, el dokuması halılar için uygun değildir.

DEPOLAMA

Uzun süreli depolama için halıyı temizlenmiş ve tamamen kurumuş halde, tüy yönünde rulolayın. Plastik ambalajdan kaçının; hava sirkülasyonuna izin veren bez örtü kullanın.`,
      isPublished: true,
      publishedAt: new Date(),
      readTime: 4,
      categoryId: bakimCat?.id,
      authorName: "ESAMIR Editörü",
    },
  });
  console.log("✅ Blog posts seeded");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
